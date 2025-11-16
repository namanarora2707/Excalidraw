// Canvas service for handling API calls and WebSocket communication

import { canvasAPI } from '../utils/api';
import websocketService from './websocket';

class CanvasService {
  constructor() {
    this.currentCanvasId = null;
    this.listeners = {};
    
    // Initialize WebSocket connection
    this.initWebSocket();
  }

  // Initialize WebSocket connection
  initWebSocket() {
    websocketService.connect();
    
    // Listen for real-time updates
    websocketService.on('drawingUpdate', (data) => {
      this.emit('drawingUpdate', data);
    });
    
    websocketService.on('addElement', (data) => {
      this.emit('addElement', data);
    });
    
    websocketService.on('updateElement', (data) => {
      this.emit('updateElement', data);
    });
    
    websocketService.on('deleteElement', (data) => {
      this.emit('deleteElement', data);
    });
    
    websocketService.on('canvasUpdate', (data) => {
      this.emit('canvasUpdate', data);
    });
  }

  // Join a canvas room for real-time collaboration
  joinCanvas(canvasId) {
    this.currentCanvasId = canvasId;
    websocketService.joinCanvas(canvasId);
  }

  // Leave current canvas room
  leaveCanvas() {
    this.currentCanvasId = null;
  }

  // Get all canvases for the user
  async getAllCanvases() {
    return await canvasAPI.getAllCanvases();
  }

  // Get a specific canvas by ID
  async getCanvas(id) {
    return await canvasAPI.getCanvas(id);
  }

  // Create a new canvas
  async createCanvas(canvasData) {
    const response = await canvasAPI.createCanvas(canvasData);
    
    if (response.success) {
      // Notify WebSocket server about the new canvas
      websocketService.sendCanvasUpdate(response.data._id, response.data);
    }
    
    return response;
  }

  // Update a canvas
  async updateCanvas(id, canvasData) {
    const response = await canvasAPI.updateCanvas(id, canvasData);
    
    if (response.success) {
      // Notify WebSocket server about the canvas update
      websocketService.sendCanvasUpdate(id, response.data);
    }
    
    return response;
  }

  // Delete a canvas
  async deleteCanvas(id) {
    return await canvasAPI.deleteCanvas(id);
  }

  // Send element addition to WebSocket server
  sendAddElement(element) {
    if (this.currentCanvasId) {
      websocketService.sendAddElement(this.currentCanvasId, element);
    }
  }

  // Send element update to WebSocket server
  sendUpdateElement(elementId, updates) {
    if (this.currentCanvasId) {
      websocketService.sendUpdateElement(this.currentCanvasId, elementId, updates);
    }
  }

  // Send element deletion to WebSocket server
  sendDeleteElement(elementId) {
    if (this.currentCanvasId) {
      websocketService.sendDeleteElement(this.currentCanvasId, elementId);
    }
  }

  // Send drawing update to WebSocket server
  sendDrawingUpdate(updateData) {
    if (this.currentCanvasId) {
      websocketService.sendDrawingUpdate(this.currentCanvasId, updateData);
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
const canvasService = new CanvasService();
export default canvasService;