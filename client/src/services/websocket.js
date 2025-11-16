// WebSocket service for real-time collaboration

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
    this.isConnected = false;
  }

  // Connect to WebSocket server
  connect() {
    // In a real application, you would use the actual WebSocket server URL
    // For now, we'll use a placeholder
    try {
      this.socket = new WebSocket('ws://localhost:5000');
      
      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.emit('connected');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit(data.type, data.payload);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.emit('disconnected');
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.emit('error', error);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }

  // Disconnect from WebSocket server
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.isConnected = false;
    }
  }

  // Join a canvas room
  joinCanvas(canvasId) {
    if (this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'joinCanvas',
        payload: { canvasId }
      }));
    }
  }

  // Send drawing update
  sendDrawingUpdate(canvasId, updateData) {
    if (this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'drawingUpdate',
        payload: { canvasId, ...updateData }
      }));
    }
  }

  // Send element addition
  sendAddElement(canvasId, element) {
    if (this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'addElement',
        payload: { canvasId, element }
      }));
    }
  }

  // Send element update
  sendUpdateElement(canvasId, elementId, updates) {
    if (this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'updateElement',
        payload: { canvasId, elementId, updates }
      }));
    }
  }

  // Send element deletion
  sendDeleteElement(canvasId, elementId) {
    if (this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'deleteElement',
        payload: { canvasId, elementId }
      }));
    }
  }

  // Send canvas update
  sendCanvasUpdate(canvasId, canvasData) {
    if (this.isConnected) {
      this.socket.send(JSON.stringify({
        type: 'canvasUpdate',
        payload: { canvasId, canvasData }
      }));
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