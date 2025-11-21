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
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/canvas', canvasRoutes);

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5004;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});