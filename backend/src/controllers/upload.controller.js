// src/controllers/upload.controller.js
const minioClient = require('../config/minio.js');
const crypto = require('crypto');
const sharp = require('sharp');
const ImageRecord = require('../models/image.model.js'); 

const bucketName = process.env.MINIO_BUCKET_NAME || 'images';

/**
 * @desc    Uploads a new image, applies initial resize (if requested),
 * processes a thumbnail, and saves to MinIO/MongoDB.
 * @route   POST /api/v1/upload
 */
const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const targetWidth = parseInt(req.body.width);
  const targetHeight = parseInt(req.body.height);

  try {
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const fileExtension = req.file.originalname.split('.').pop();
    
    let imageBuffer = req.file.buffer;
    let fileNamePrefix = "";

    // Apply resize to original image (if requested)
    if (targetWidth > 0 && targetHeight > 0) {
        const resizedBuffer = await sharp(imageBuffer)
            .resize(targetWidth, targetHeight)
            .jpeg({ quality: 95 })
            .toBuffer();
        
        imageBuffer = resizedBuffer;
        fileNamePrefix = `resized-${targetWidth}x${targetHeight}-`;
    }

    const originalObjectName = `${fileNamePrefix}${Date.now()}-${randomBytes}.${fileExtension}`;
    const thumbnailObjectName = `thumb-${originalObjectName}`;

    // Create the Thumbnail (always 200x200)
    const thumbnailBuffer = await sharp(imageBuffer)
      .resize(200, 200)
      .jpeg({ quality: 90 })
      .toBuffer();

    // Save the (potentially resized) Original Image
    await minioClient.putObject(bucketName, originalObjectName, imageBuffer, 'image/jpeg');

    // Save the Thumbnail
    await minioClient.putObject(bucketName, thumbnailObjectName, thumbnailBuffer, 'image/jpeg');

    // Save record
    const newRecord = new ImageRecord({
      originalFilename: originalObjectName,
      thumbnailFilename: thumbnailObjectName,
      bucket: bucketName,
      processType: targetWidth > 0 ? `Upload Resize ${targetWidth}x${targetHeight}` : 'Original Upload'
    });
    await newRecord.save();

    res.status(200).json({
      message: 'File processed and stored successfully!',
      original: originalObjectName,
      thumbnail: thumbnailObjectName,
      bucket: bucketName,
    });
  } catch (error) {
    console.error('Error in uploadImage:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc    Fetches all image records and generates pre-signed URLs
 * @route   GET /api/v1/upload
 */
const getAllImages = async (req, res) => {
  try {
    const records = await ImageRecord.find().sort({ createdAt: -1 });

    const imagesWithUrls = await Promise.all(
      records.map(async (record) => {
        const thumbnailUrl = await minioClient.presignedGetObject(
          bucketName,
          record.thumbnailFilename,
          3600
        );

        return {
          _id: record._id,
          createdAt: record.createdAt,
          thumbnailUrl: thumbnailUrl,
          thumbnailFilename: record.thumbnailFilename,
        };
      })
    );

    res.status(200).json(imagesWithUrls);
  } catch (error) {
    console.error('Error in getAllImages:', error);
    res.status(500).json({ message: 'Error fetching images.' });
  }
};

/**
 * @desc    Processes a saved image (Resize/Grayscale)
 * @route   POST /api/v1/process
 */
const processImage = async (req, res) => {
  const { filename, width, height, operation } = req.body; 
  
  if (!filename) return res.status(400).json({ message: 'Filename required for processing.' });

  try {
    const bucketName = process.env.MINIO_BUCKET_NAME || 'images';
    
    // Download the file buffer from MinIO
    const stream = await minioClient.getObject(bucketName, filename);
    const originalBuffer = await new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });

    let sharpPipeline = sharp(originalBuffer);
    let processName = "processed";

    // Apply chosen transformations
    if (operation === 'resize' && width && height) {
      const w = parseInt(width);
      const h = parseInt(height);
      if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
        sharpPipeline = sharpPipeline.resize(w, h);
        processName = `resized-${w}x${h}`;
      } else {
        return res.status(400).json({ message: 'Invalid dimensions for resize.' });
      }
    } else if (operation === 'grayscale') {
      sharpPipeline = sharpPipeline.grayscale();
      processName = 'grayscale';
    } else {
      return res.status(400).json({ message: 'Invalid operation or missing parameters.' });
    }

    // Execute the pipeline
    const processedBuffer = await sharpPipeline.jpeg({ quality: 90 }).toBuffer();

    // Generate a new unique filename and upload
    const newFilename = `${processName}-${filename}`;
    
    await minioClient.putObject(bucketName, newFilename, processedBuffer, 'image/jpeg');

    // Save a new record
    const newRecord = new ImageRecord({ originalFilename: newFilename, thumbnailFilename: newFilename, bucket: bucketName, processType: processName, });
    await newRecord.save();

    res.status(200).json({ message: `Image ${processName} and saved as ${newFilename}`, newFilename, });
  } catch (error) {
    console.error(`Error during image processing:`, error);
    res.status(500).json({ message: `Error processing image: ${error.message}` });
  }
};

/**
 * @desc    Deletes a record from DB and the associated file from MinIO
 * @route   DELETE /api/v1/upload/:id
 */
const deleteImage = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: 'Record ID required.' });
  try {
    const record = await ImageRecord.findById(id);
    if (!record) return res.status(404).json({ message: 'Image record not found.' });

    // Delete the file(s) from MinIO
    await minioClient.removeObject(bucketName, record.thumbnailFilename);

    // Delete the record from MongoDB
    await ImageRecord.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Image and record deleted successfully.', deletedId: id, });
  } catch (error) {
    console.error('Error during image deletion:', error);
    res.status(500).json({ message: `Error deleting image: ${error.message}` });
  }
};

/**
 * @desc    Generates a secure, temporary download URL for a file
 * @route   GET /api/v1/upload/download/:filename
 */
const getDownloadUrl = async (req, res) => {
  const { filename } = req.params;

  if (!filename) return res.status(400).json({ message: 'Filename required for download.' });

  try {
    const bucketName = process.env.MINIO_BUCKET_NAME || 'images';

    // MinIO presignedGetObject creates a temporary URL valid for 1 hour (3600s)
    const downloadUrl = await minioClient.presignedGetObject(
      bucketName,
      filename,
      3600 
    );

    // Send the URL back to the client
    res.status(200).json({ downloadUrl });
  } catch (error) {
    console.error('Error generating download URL:', error);
    res.status(500).json({ message: 'Error generating download link.' });
  }
};

/**
 * @desc    TEMPORARY: Clears all records from the MongoDB database
 * @route   DELETE /api/v1/upload/clear
 */
const clearDatabase = async (req, res) => {
  try {
    const result = await ImageRecord.deleteMany({});
    res.status(200).json({ message: `Successfully deleted ${result.deletedCount} records from the database.`, });
  } catch (error) {
    console.error('Error clearing database:', error);
    res.status(500).json({ message: 'Error clearing database.' });
  }
};


module.exports = {
  uploadImage,
  getAllImages,
  deleteImage,
  clearDatabase,
  processImage,
  getDownloadUrl, // <-- NEW EXPORT
};