import axios from 'axios';

// Use environment variable or default to Railway production URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://world-cup-fantasy-league-production-f789.up.railway.app';

// Set global axios base URL for relative API calls
axios.defaults.baseURL = API_BASE_URL;

export default axios;
