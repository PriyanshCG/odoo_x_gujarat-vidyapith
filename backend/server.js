// Load our packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Create express app
const app = express();

// Middleware - things that process requests
app.use(cors());           // Allow frontend to connect
app.use(express.json());   // Understand JSON data

// MongoDB connection - using your local MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/fleetflow';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Test route - to check if server is working
app.get('/api/test', (req, res) => {
    res.json({ message: 'FleetFlow backend is working!' });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});