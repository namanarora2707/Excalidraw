const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const canvasRoutes = require('./routes/canvas');

// Import database connection
const connectDB = require('./config/db');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  // Add path for compatibility with frontend
  path: '/socket.io'
});

// Connect to database
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
  console.log('Continuing without database connection for testing purposes');
});

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Requested-With']
};

console.log('CORS configuration:', corsOptions);
// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(cors(corsOptions));
app.use(express.json());

// Handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  res.sendStatus(200);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test endpoint for auth routes
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API routes are working' });
});

// Test endpoint for auth routes
app.post('/api/auth/test-register', (req, res) => {
  res.status(200).json({ message: 'Auth register route is accessible', received: req.body });
});

// Simple test endpoint
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Test all routes
app.get('/routes', (req, res) => {
  res.status(200).json({ 
    message: 'Available routes',
    routes: [
      'GET /test',
      'GET /health',
      'GET /api/test',
      'POST /api/auth/test-register',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/profile (protected)',
      'GET /api/canvas (protected)',
      'POST /api/canvas (protected)',
      'GET /api/canvas/:id (protected)',
      'PUT /api/canvas/:id (protected)',
      'DELETE /api/canvas/:id (protected)'
    ]
  });
});

// Routes
app.use('/api/auth', (req, res, next) => {
  console.log('Auth route middleware hit:', req.method, req.url);
  next();
}, authRoutes);
app.use('/api/canvas', (req, res, next) => {
  console.log('Canvas route middleware hit:', req.method, req.url);
  next();
}, canvasRoutes);

// Verify routes are loaded
console.log('Auth routes loaded:', !!authRoutes);
console.log('Canvas routes loaded:', !!canvasRoutes);

// API Routes Debugging
app.use('/api', (req, res, next) => {
  console.log('API route hit:', req.method, req.url);
  console.log('Full URL:', req.protocol + '://' + req.get('host') + req.originalUrl);
  next();
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a canvas room
  socket.on('joinCanvas', (canvasId) => {
    socket.join(canvasId);
    console.log(`Client ${socket.id} joined canvas ${canvasId}`);
  });

  // Handle drawing updates
  socket.on('drawingUpdate', (data) => {
    console.log('Received drawingUpdate from client:', socket.id, data);
    // Broadcast to all other clients in the same canvas room
    socket.to(data.canvasId).emit('drawingUpdate', data);
  });

  // Handle element additions
  socket.on('addElement', (data) => {
    console.log('Received addElement from client:', socket.id, data);
    socket.to(data.canvasId).emit('addElement', data);
  });

  // Handle element updates
  socket.on('updateElement', (data) => {
    console.log('Received updateElement from client:', socket.id, data);
    socket.to(data.canvasId).emit('updateElement', data);
  });

  // Handle element deletions
  socket.on('deleteElement', (data) => {
    console.log('Received deleteElement from client:', socket.id, data);
    socket.to(data.canvasId).emit('deleteElement', data);
  });

  // Handle canvas updates
  socket.on('canvasUpdate', (data) => {
    console.log('Received canvasUpdate from client:', socket.id, data);
    socket.to(data.canvasId).emit('canvasUpdate', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// 404 handler
app.use((req, res, next) => {
  console.log('404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5004;
console.log('Starting server on port:', PORT);
console.log('Environment variables:');
console.log('CLIENT_URL:', process.env.CLIENT_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
// Note: VITE_BACKEND_URL should be set in client, not server

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Server is ready to handle requests');
  
  // Test if server is accessible
  console.log('Server routes mounted:');
  console.log('- /api/auth/*');
  console.log('- /api/canvas/*');
  console.log('- /health');
  console.log('- /test');
});

// Handle server startup errors
server.on('error', (error) => {
  console.error('Server startup error:', error);
});