const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// GET all drivers
router.get('/', async (req, res) => {
    try {
        const drivers = await Driver.find().sort({ createdAt: -1 });
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST create new driver
router.post('/', async (req, res) => {
    try {
        const driver = new Driver(req.body);
        await driver.save();
        res.status(201).json(driver);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET check if license is valid
router.get('/:id/license-valid', async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.json({ valid: false });
        }
        
        const today = new Date();
        const expiry = new Date(driver.license_expiry);
        const isValid = expiry > today;
        
        res.json({ valid: isValid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT update driver status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const driver = await Driver.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );
        res.json(driver);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;