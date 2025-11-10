// src/routes/process.routes.js
const { Router } = require('express');
const { processImage } = require('../controllers/upload.controller.js');

const router = Router();

// Route for general image processing (handles resize and grayscale)
router.route('/').post(processImage); 

module.exports = router;