// lib/axios.ts
import axios from 'axios';

// Create an Axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token, logging, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve token from wherever you store it (localStorage, cookie, context)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp or other metadata
    config.headers['X-Request-Time'] = new Date().toISOString();
    
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle responses globally
apiClient.interceptors.response.use(
  (response) => {
    // You can process successful responses here
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    // Handle error responses globally
    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      console.error('API Error Response:', error.response.status, error.response.data);
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Redirect to login or clear auth tokens
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          // Optionally redirect to login
          // window.location.href = '/login';
        }
      } else if (error.response.status === 403) {
        console.error('Access forbidden');
      } else if (error.response.status >= 500) {
        console.error('Server error occurred');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;