import axios from 'axios';

// Use environment variable or default to Railway production URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://world-cup-fantasy-league-production-f789.up.railway.app';

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: API_BASE_URL
});

// Interceptor to rewrite localhost URLs to the API base URL
axiosInstance.interceptors.request.use(config => {
  // If the URL starts with http://localhost:5000, replace it with the API_BASE_URL
  if (config.url && config.url.startsWith('http://localhost:5000')) {
    config.url = config.url.replace('http://localhost:5000', API_BASE_URL);
  }
  return config;
});

export default axiosInstance;
