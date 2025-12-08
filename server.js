const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { testConnection } = require('./config/database');

// Import routes
const travelersRoutes = require('./routes/travelers');
const itineraryRoutes = require('./routes/itinerary');
const vehiclesRoutes = require('./routes/vehicles');
const postsRoutes = require('./routes/posts');
const roomPairsRoutes = require('./routes/roomPairs');
const checkInsRoutes = require('./routes/checkIns');
const settingsRoutes = require('./routes/settings');
const hotelsRoutes = require('./routes/hotels');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Yatra API Server is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/travelers', travelersRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/room-pairs', roomPairsRoutes);
app.use('/api/check-ins', checkInsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/hotels', hotelsRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found', 
        message: `Route ${req.method} ${req.path} not found` 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
async function startServer() {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
        console.error('⚠️  Warning: Database connection failed. Server will start but API calls may fail.');
    }

    app.listen(PORT, () => {
        console.log(`🚀 Yatra API Server running on http://localhost:${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
}

startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

