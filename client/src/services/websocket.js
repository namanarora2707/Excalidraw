// WebSocket service for real-time collaboration using Socket.IO
import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
    this.isConnected = false;
  }

  // Connect to WebSocket server
  connect() {
    try {
      // Use the actual Socket.IO server URL
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5004';
            // Ensure WebSocket uses the correct protocol (ws for http, wss for https)
            const wsUrl = backendUrl.replace(/^https/, 'wss').replace(/^http/, 'ws');
      console.log('Connecting to Socket.IO server at:', backendUrl);
      
      this.socket = io(wsUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        // Add path if needed for compatibility with backend
        path: '/socket.io'
      });
      
      this.socket.on('connect', () => {
        console.log('Socket.IO connected with ID:', this.socket.id);
        this.isConnected = true;
        this.emit('connected');
      });

      this.socket.on('disconnect', () => {
        console.log('Socket.IO disconnected');
        this.isConnected = false;
        this.emit('disconnected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        this.emit('error', error);
      });

      // Listen for all custom events and emit them to local listeners
      this.socket.on('drawingUpdate', (payload) => {
        console.log('Received drawingUpdate event:', payload);
        this.emit('drawingUpdate', payload);
      });
      
      this.socket.on('addElement', (payload) => {
        console.log('Received addElement event:', payload);
        this.emit('addElement', payload);
      });
      
      this.socket.on('updateElement', (payload) => {
        console.log('Received updateElement event:', payload);
        this.emit('updateElement', payload);
      });
      
      this.socket.on('deleteElement', (payload) => {
        console.log('Received deleteElement event:', payload);
        this.emit('deleteElement', payload);
      });
      
      this.socket.on('canvasUpdate', (payload) => {
        console.log('Received canvasUpdate event:', payload);
        this.emit('canvasUpdate', payload);
      });
    } catch (error) {
      console.error('Error connecting to Socket.IO:', error);
    }
  }

  // Disconnect from WebSocket server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  // Join a canvas room
  joinCanvas(canvasId) {
    console.log('Joining canvas room:', canvasId);
    if (this.isConnected && this.socket) {
      this.socket.emit('joinCanvas', canvasId);
    } else {
      console.warn('Cannot join canvas room - not connected to Socket.IO server');
    }
  }

  // Send drawing update
  sendDrawingUpdate(canvasId, updateData) {
    if (this.isConnected && this.socket) {
      this.socket.emit('drawingUpdate', { canvasId, ...updateData });
    }
  }

  // Send element addition
  sendAddElement(canvasId, element) {
    console.log('Sending addElement event:', { canvasId, element });
    if (this.isConnected && this.socket) {
      this.socket.emit('addElement', { canvasId, element });
    }
  }

  // Send element update
  sendUpdateElement(canvasId, elementId, updates) {
    console.log('Sending updateElement event:', { canvasId, elementId, updates });
    if (this.isConnected && this.socket) {
      this.socket.emit('updateElement', { canvasId, elementId, updates });
    }
  }

  // Send element deletion
  sendDeleteElement(canvasId, elementId) {
    console.log('Sending deleteElement event:', { canvasId, elementId });
    if (this.isConnected && this.socket) {
      this.socket.emit('deleteElement', { canvasId, elementId });
    }
  }

  // Send canvas update
  sendCanvasUpdate(canvasId, canvasData) {
    if (this.isConnected && this.socket) {
      this.socket.emit('canvasUpdate', { canvasId, canvasData });
    }
  }

  // Add event listener
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  // Emit event to all listeners
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

// Create and export singleton instance
const websocketService = new WebSocketService();
export default websocketService;