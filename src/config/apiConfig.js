import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { refreshToken as refreshAuthToken } from '../services/authService'; // To refresh token if needed
import { BASE_URL } from '../utils/sharesUtils';
// Your Django backend URL

// Create an axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Set a timeout (in milliseconds) for requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor for adding Authorization token from AsyncStorage
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for handling responses and refreshing tokens if expired
apiClient.interceptors.response.use(
  (response) => response, // Return the response if no errors
  async (error) => {
    const originalRequest = error.config;

    // Handle unauthorized error (401) and try refreshing the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loop
      try {
        // Attempt to refresh the token
        const newAccessToken = await refreshAuthToken();
        if (newAccessToken) {
          // Update the authorization header with the new token
          apiClient.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          
          // Retry the original request with the new token
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
