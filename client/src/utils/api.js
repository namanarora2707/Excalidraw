// API utility functions for interacting with the backend

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '/api';

// Helper function for making API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    // Handle successful responses
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    }
    
    // Handle error responses
    const errorData = await response.json();
    return { success: false, error: errorData.message || 'Something went wrong' };
  } catch (error) {
    console.error('API request failed:', error);
    return { success: false, error: 'Network error - please try again' };
  }
};

export const authAPI = {
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get user profile
  getProfile: async () => {
    return apiRequest('/auth/profile');
  },
};

// Canvas API functions
export const canvasAPI = {
  // Get all canvases for the user
  getAllCanvases: async () => {
    return apiRequest('/canvas');
  },

  // Get a specific canvas by ID
  getCanvas: async (id) => {
    return apiRequest(`/canvas/${id}`);
  },

  // Create a new canvas
  createCanvas: async (canvasData) => {
    return apiRequest('/canvas', {
      method: 'POST',
      body: JSON.stringify(canvasData),
    });
  },

  // Update a canvas
  updateCanvas: async (id, canvasData) => {
    return apiRequest(`/canvas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(canvasData),
    });
  },

  // Delete a canvas
  deleteCanvas: async (id) => {
    return apiRequest(`/canvas/${id}`, {
      method: 'DELETE',
    });
  },
};