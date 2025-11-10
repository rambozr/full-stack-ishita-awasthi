// src/models/image.model.js
const mongoose = require('mongoose');

// Define the "schema" or blueprint
const ImageRecordSchema = new mongoose.Schema(
  {
    originalFilename: {
      type: String,
      required: true,
    },
    thumbnailFilename: {
      type: String,
      required: true,
    },
    bucket: {
      type: String,
      required: true,
    },
  },
  {
    // This automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

// Create the model from the schema
const ImageRecord = mongoose.model('ImageRecord', ImageRecordSchema);

module.exports = ImageRecord;