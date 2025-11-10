// src/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db/index.js');
const uploadRouter = require('./routes/upload.routes.js');
const processRouter = require('./routes/process.routes.js');

// Load environment variables
dotenv.config();

// Create the app instance
const app = express();
const PORT = process.env.PORT || 8000;

// --- Setup Middleware ---
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend's address
  credentials: true
}));
app.use(express.json()); // To parse JSON bodies

// --- Setup Routes ---
app.get('/', (req, res) => {
  res.json({ message: 'Hello from the backend server!' });
});
app.use('/api/v1/upload', uploadRouter);
app.use('/api/v1/process', processRouter); 
app.use('/api/v1/upload', uploadRouter);

// --- Connect to DB, THEN Start Server ---
// This is the new, corrected logic
connectDB()
  .then(() => {
    // This code runs *after* the connection is successful
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed. Server did not start.", err);
    process.exit(1);
  });