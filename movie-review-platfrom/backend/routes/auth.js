const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Simple test route (no controller needed)
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: "Auth route is working!",
        timestamp: new Date().toISOString()
    });
});

// Debug route to check request body
router.post('/debug-body', (req, res) => {
    console.log('Raw body:', req.body);
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('Headers:', req.headers);
    
    res.json({
        success: true,
        body: req.body,
        contentType: req.get('Content-Type'),
        bodyKeys: Object.keys(req.body || {}),
        bodyValues: Object.values(req.body || {}),
        hasBody: !!req.body,
        bodyType: typeof req.body
    });
});

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);

module.exports = router;