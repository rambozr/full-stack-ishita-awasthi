// src/routes/upload.routes.js
const { Router } = require('express');
const upload = require('../middlewares/multer.middleware.js');

const {
  uploadImage,
  getAllImages,
  deleteImage,
  clearDatabase, 
  getDownloadUrl, // <-- NEW IMPORT
} = require('../controllers/upload.controller.js');

const router = Router();

// POST route for uploading a new image
router.route('/').post(upload.single('image'), uploadImage);

// GET route for fetching all images
router.route('/').get(getAllImages);

// DELETE route for a single image by ID
router.route('/:id').delete(deleteImage);

// --- NEW DOWNLOAD ROUTE ---
router.route('/download/:filename').get(getDownloadUrl);

// DELETE route for clearing all images (temporary)
router.route('/clear').delete(clearDatabase);

module.exports = router;