const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

// GET all trips
router.get('/', async (req, res) => {
    try {
        const trips = await Trip.find()
            .populate('vehicle_id')
            .populate('driver_id')
            .sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create new trip with validation
router.post('/', async (req, res) => {
    try {
        const { vehicle_id, driver_id, cargo_weight, start_location, end_location } = req.body;
        
        // STEP 1: Check vehicle
        const vehicle = await Vehicle.findById(vehicle_id);
        if (!vehicle) {
            return res.status(400).json({ error: 'Vehicle not found' });
        }
        
        // Check if vehicle is available
        if (vehicle.status !== 'Available') {
            return res.status(400).json({ error: 'Vehicle is not available' });
        }
        
        // Check cargo weight against capacity
        if (cargo_weight > vehicle.max_load) {
            return res.status(400).json({ 
                error: `Cargo weight ${cargo_weight}kg exceeds vehicle capacity ${vehicle.max_load}kg` 
            });
        }
        
        // STEP 2: Check driver
        const driver = await Driver.findById(driver_id);
        if (!driver) {
            return res.status(400).json({ error: 'Driver not found' });
        }
        
        // Check if driver is On Duty
        if (driver.status !== 'On Duty') {
            return res.status(400).json({ error: 'Driver is not on duty' });
        }
        
        // Check license expiry
        const today = new Date();
        const expiry = new Date(driver.license_expiry);
        if (expiry <= today) {
            return res.status(400).json({ error: 'Driver license has expired' });
        }
        
        // STEP 3: Create trip
        const trip = new Trip({
            vehicle_id,
            driver_id,
            cargo_weight,
            start_location,
            end_location,
            status: 'Dispatched',
            start_time: new Date()
        });
        
        await trip.save();
        
        // STEP 4: Update vehicle and driver status
        vehicle.status = 'On Trip';
        await vehicle.save();
        
        driver.status = 'On Trip';
        await driver.save();
        
        res.status(201).json({
            success: true,
            trip: trip,
            message: 'Trip created successfully'
        });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT complete trip
router.put('/:id/complete', async (req, res) => {
    try {
        const { odometer_end } = req.body;
        
        // Find trip
        const trip = await Trip.findById(req.params.id);
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        
        // Update trip
        trip.status = 'Completed';
        trip.end_time = new Date();
        trip.odometer_end = odometer_end;
        await trip.save();
        
        // Update vehicle
        const vehicle = await Vehicle.findById(trip.vehicle_id);
        if (vehicle) {
            vehicle.status = 'Available';
            vehicle.odometer = odometer_end;
            await vehicle.save();
        }
        
        // Update driver
        const driver = await Driver.findById(trip.driver_id);
        if (driver) {
            driver.status = 'On Duty';
            await driver.save();
        }
        
        res.json({ success: true, trip });
        
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;