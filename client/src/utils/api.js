// API utility functions for interacting with the backend

// Use the backend URL from environment variables
// In production, this should be the full backend URL
// In development, this might be empty and we'll use relative paths
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// In development, we use relative paths (empty base URL)
// In production, we use the full backend URL
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment ? '' : (VITE_BACKEND_URL || '');

// Validate that we have a backend URL in production
if (!isDevelopment && !VITE_BACKEND_URL) {
  console.error('Missing VITE_BACKEND_URL in production environment');
}

console.log('Environment detection:', { isDevelopment, VITE_BACKEND_URL, API_BASE_URL });

// Log the configuration for debugging
console.log('API Configuration:', { 
  VITE_BACKEND_URL, 
  API_BASE_URL,
  windowOrigin: window.location.origin
});

// Helper function for making API requests
const apiRequest = async (endpoint, options = {}) => {
  // Construct the full URL
  // Ensure we don't have double slashes
  let basePath = API_BASE_URL;
  // Remove trailing slash from base path if present
  if (basePath && basePath.endsWith('/')) {
    basePath = basePath.slice(0, -1);
  }
  // Ensure endpoint starts with /api/
  let endpointPath = endpoint;
  if (!endpoint.startsWith('/api/')) {
    if (endpoint.startsWith('/')) {
      endpointPath = `/api${endpoint}`;
    } else {
      endpointPath = `/api/${endpoint}`;
    }
  }
  // Handle the case where we have an empty base path (development)
  const url = basePath ? `${basePath}${endpointPath}` : endpointPath;
  
  console.log('URL Construction:', { basePath, endpointPath, finalUrl: url });
  
  console.log(`Making API request to ${url}`);
  
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
    console.log('Making API request to:', url);
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
    return { success: false, error: errorData.message || `HTTP ${response.status}: ${response.statusText}` };
  } catch (error) {
    console.error('Network error:', error.message || error);
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { success: false, error: 'Network error - unable to connect to server. Please check your internet connection and try again.' };
    }
    
    return { success: false, error: `Network error: ${error.message || 'Unknown error'}` };
  }
};

export const authAPI = {
  // Health check
  healthCheck: async () => {
    return apiRequest('/health');
  },
  
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
  
  // Test auth routes
  testRegister: async (userData) => {
    return apiRequest('/auth/test-register', {
      method: 'POST',
      body: JSON.stringify(userData),
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