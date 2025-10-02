import axios from "axios";
import { getAuth } from "firebase/auth";

const API = axios.create({ 
  baseURL: "http://localhost:5000/api",
  headers: {
    'Content-Type': 'application/json'
  }
});

// attach Firebase token automatically
API.interceptors.request.use(async (config) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.warn('No user is logged in');
      return config;
    }

    const token = await user.getIdToken(true); // Force token refresh
    if (!token) {
      throw new Error('Failed to get Firebase token');
    }

    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Token attached to request:', config.url);
    return config;
  } catch (error) {
    console.error('❌ Error in request interceptor:', error);
    return Promise.reject(error);
  }
});

// Add response interceptor for better error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('❌ API Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('❌ No response received:', error.request);
    } else {
      console.error('❌ Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default API;
