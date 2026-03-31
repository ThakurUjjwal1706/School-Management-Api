require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const schoolRoutes = require('./routes/schoolRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({ origin: '*' })); // Useful for public APIs deployed on Railway/Render
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api', schoolRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'School Management API is running and ready to accept requests.' });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global error handler
app.use(errorHandler);

// Start server with proper environment handling
if (!PORT) {
    console.error('CRITICAL ERROR: PORT is not defined, and fallback failed.');
    process.exit(1);
}

const server = app.listen(PORT, () => {
    console.log(`🚀 Server successfully started and running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
    } else {
        console.error(`❌ Failed to start server on port ${PORT}:`, err.message);
    }
    process.exit(1);
});
