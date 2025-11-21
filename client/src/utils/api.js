// API utility functions for interacting with the backend

// Use the backend URL from environment variables, or default to '/api' for same-domain requests
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '/api';
console.log('Using API_BASE_URL:', API_BASE_URL);
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Window location:', window.location.origin);
console.log('VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);

// Helper function for making API requests
const apiRequest = async (endpoint, options = {}) => {
  // Ensure endpoint starts with '/'
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;
  
  console.log(`Making API request to ${url} with options:`, options);
  console.log('Full request URL:', url);
  
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
    console.log('Making API request to:', url, config);
    console.log('Fetch options:', {
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body
    });
    const response = await fetch(url, config);
    
    // Handle successful responses
    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    }
    
    // Handle error responses
    let errorData;
    try {
      errorData = await response.json();
    } catch (parseError) {
      errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
    }
    
    console.error('API request failed with status:', response.status, errorData);
    console.error('Response headers:', response.headers);
    console.error('Response URL:', response.url);
    return { success: false, error: errorData.message || `HTTP ${response.status}: ${response.statusText}` };
  } catch (error) {
    console.error('Network error:', error);
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { success: false, error: 'Network error - unable to connect to server. Please check your internet connection and try again.' };
    }
    
    return { success: false, error: `Network error: ${error.message || 'Unknown error'}` };
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