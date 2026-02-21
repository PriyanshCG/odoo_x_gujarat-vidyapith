const mongoose = require('mongoose');

// Define the schema for vehicles
const vehicleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    license_plate: {
        type: String,
        required: true,
        unique: true  // No duplicate license plates
    },
    max_load: {
        type: Number,
        required: true
    },
    odometer: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Available', 'On Trip', 'In Shop', 'Out of Service'],
        default: 'Available'
    }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt
});

// Create and export the model
module.exports = mongoose.model('Vehicle', vehicleSchema);