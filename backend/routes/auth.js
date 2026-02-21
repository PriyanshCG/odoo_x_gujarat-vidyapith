const express = require('express');
const router = express.Router();

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    // For demo, we'll use hardcoded users
    // In real app, you'd check database
    if (email === 'manager@fleetflow.com' && password === 'password') {
        res.json({
            success: true,
            user: {
                id: 1,
                name: 'Manager',
                role: 'manager',
                email: email
            },
            token: 'demo-token-123'
        });
    } else if (email === 'dispatcher@fleetflow.com' && password === 'password') {
        res.json({
            success: true,
            user: {
                id: 2,
                name: 'Dispatcher',
                role: 'dispatcher',
                email: email
            },
            token: 'demo-token-456'
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }
});

module.exports = router;