import axios from 'axios';

// Use environment variable or default to Railway production URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://world-cup-fantasy-league-production-f789.up.railway.app';

// Set the default axios base URL so all axios requests use the Railway backend
axios.defaults.baseURL = API_BASE_URL;

// Interceptor to rewrite hardcoded localhost URLs to the API base URL
axios.interceptors.request.use(config => {
  if (config.url && config.url.startsWith('http://localhost:5000')) {
    config.url = config.url.replace('http://localhost:5000', API_BASE_URL);
  }
  return config;
});
