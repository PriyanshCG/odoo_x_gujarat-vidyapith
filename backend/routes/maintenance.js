const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle');

// GET all maintenance records
router.get('/', async (req, res) => {
    try {
        const records = await Maintenance.find()
            .populate('vehicle_id')
            .sort({ service_date: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST add maintenance
router.post('/', async (req, res) => {
    try {
        const { vehicle_id, description, cost } = req.body;
        
        // Create maintenance record
        const maintenance = new Maintenance({
            vehicle_id,
            description,
            cost,
            service_date: new Date()
        });
        
        await maintenance.save();
        
        // Update vehicle status to 'In Shop'
        await Vehicle.findByIdAndUpdate(vehicle_id, { status: 'In Shop' });
        
        res.status(201).json({
            success: true,
            maintenance,
            message: 'Vehicle marked as In Shop'
        });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT complete maintenance
router.put('/:vehicle_id/complete', async (req, res) => {
    try {
        await Vehicle.findByIdAndUpdate(
            req.params.vehicle_id,
            { status: 'Available' }
        );
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;