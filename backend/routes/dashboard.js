const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const Trip = require('../models/Trip');

router.get('/', async (req, res) => {
    try {
        // Get counts
        const activeFleet = await Vehicle.countDocuments({ status: 'On Trip' });
        const inShop = await Vehicle.countDocuments({ status: 'In Shop' });
        const totalVehicles = await Vehicle.countDocuments();
        const pendingTrips = await Trip.countDocuments({ status: 'Draft' });
        
        // Calculate utilization rate
        const utilizationRate = totalVehicles > 0 
            ? Math.round((activeFleet / totalVehicles) * 100) 
            : 0;
        
        res.json({
            activeFleet,
            inShop,
            totalVehicles,
            pendingTrips,
            utilizationRate
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;