// Updated email service logging - May 15, 2025 - v2
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const emailRoutes = require('./routes/emailRoutes');
const stripeRoutes = require('./routes/stripeRoutes');

// Deployment tracking with Swiss timezone
const getSwissTime = () => {
  return new Date().toLocaleString('en-CH', {
    timeZone: 'Europe/Zurich',
    dateStyle: 'full',
    timeStyle: 'long'
  });
};

const deploymentTimestamp = getSwissTime();
const deploymentId = Math.random().toString(36).substring(7);

// Initialize express app
const app = express();

// Set up CORS
const corsOrigins = process.env.NODE_ENV === 'production' 
  ? [
      'https://elitewaylimo.ch', 
      'https://www.elitewaylimo.ch',
      'https://api.elitewaylimo.ch'
    ]
  : ['http://localhost:5173', 'http://127.0.0.1:5173']; // Vite's default dev server ports

app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Stripe-Signature'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Webhook route must come before any body parsers
app.post('/api/stripe/webhook', express.raw({type: 'application/json'}), require('./routes/webhookHandler'));

// Regular body parsing for other routes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Define routes
app.use('/api/email', emailRoutes);
app.use('/api/stripe', stripeRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Limos Rental Email Service API is running!', 
    deploymentInfo: {
      timestamp: deploymentTimestamp,
      currentTime: getSwissTime(),
      id: deploymentId,
      environment: process.env.NODE_ENV,
      timezone: 'Europe/Zurich'
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

// Enhanced health check endpoint with Swiss time
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    currentTime: getSwissTime(),
    uptime: process.uptime(),
    deploymentInfo: {
      timestamp: deploymentTimestamp,
      id: deploymentId,
      environment: process.env.NODE_ENV,
      timezone: 'Europe/Zurich'
    },
    memory: process.memoryUsage()
  });
});

// Test email route
app.get('/api/test-email', async (req, res) => {
  try {
    const emailService = require('./services/emailService');
    const now = new Date();
    const swissDate = now.toLocaleDateString('en-CH', {
      timeZone: 'Europe/Zurich',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).split('.').reverse().join('-');
    
    const swissTime = now.toLocaleTimeString('en-CH', {
      timeZone: 'Europe/Zurich',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const testReservation = {
      email: 'test@example.com',
      phone: '123-456-7890',
      date: swissDate,
      time: swissTime,
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
      result,
      testTime: getSwissTime()
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      message: 'Error sending test email', 
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});