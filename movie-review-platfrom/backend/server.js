const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// CORS must come BEFORE body parser
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true
}));

// Body parser middleware - CRITICAL ORDER
app.use(express.json({ 
    limit: '10mb',
    strict: true,
    type: 'application/json'
}));
app.use(express.urlencoded({ 
    extended: true,
    limit: '10mb'
}));

// Other middleware AFTER body parser
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(morgan('combined'));

// Import routes AFTER all middleware
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const reviewRoutes = require('./routes/reviews');
// const userRoutes = require('./routes/users'); // Commented out for now

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
// app.use('/api/users', userRoutes); // Commented out for now

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running!',
        timestamp: new Date().toISOString()
    });
});

// Debug route
app.get('/debug/routes', (req, res) => {
    res.json({
        success: true,
        message: 'Routes debug',
        availableRoutes: [
            'GET /api/health',
            'GET /debug/routes',
            'GET /api/auth/test',
            'POST /api/auth/debug-body',
            'POST /api/auth/register',
            'POST /api/auth/login',
            'GET /api/auth/me'
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler (must be last)
app.use((req, res) => {
    console.log(`Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});