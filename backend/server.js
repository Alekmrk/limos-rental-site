// Updated email service logging - May 3, 2025
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const emailRoutes = require('./routes/emailRoutes');

// Deployment tracking
const deploymentTimestamp = new Date().toISOString();
const deploymentId = Math.random().toString(36).substring(7);

// Initialize express app
const app = express();

// Set up middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Increase JSON payload size limit to 50mb
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Define routes
app.use('/api/email', emailRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Limos Rental Email Service API is running!', 
    deploymentInfo: {
      timestamp: deploymentTimestamp,
      id: deploymentId,
      environment: process.env.NODE_ENV
    },
    env: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER ? '****' + process.env.EMAIL_USER.substr(-4) : 'Not set',
      from: process.env.EMAIL_FROM,
      adminEmail: process.env.ADMIN_EMAIL
    }
  });
});

// Enhanced health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    uptime: process.uptime(),
    deploymentInfo: {
      timestamp: deploymentTimestamp,
      id: deploymentId,
      environment: process.env.NODE_ENV
    },
    memory: process.memoryUsage()
  });
});

// Test email route
app.get('/api/test-email', async (req, res) => {
  try {
    const emailService = require('./services/emailService');
    const testReservation = {
      email: 'test@example.com',
      phone: '123-456-7890',
      date: '2025-05-01',
      time: '14:00',
      pickup: 'Test Pickup Location',
      dropoff: 'Test Dropoff Location',
      isSpecialRequest: false,
      isHourly: false,
      selectedVehicle: { name: 'Test Vehicle' },
      passengers: 2,
      bags: 1
    };
    
    console.log('Sending test email...');
    const result = await emailService.sendToAdmin(testReservation);
    res.json({ 
      message: 'Test email sent. Check console for details.', 
      result 
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      message: 'Error sending test email', 
      error: error.message 
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});