// services/authService.js

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/sharesUtils';

// Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Login service
export const loginUser = async (username, password) => {
  try {
    const response = await apiClient.post('/auth/login/', { username, password });
    const { key } = response.data;

    if (key && typeof key === 'string') {
      console.log('🔐 Token from backend:', key);
      return { key };
    } else {
      console.error('❗ Backend response does not contain a valid token:', response.data);
      return null;
    }
  } catch (error) {
    console.error('❌ loginUser error:', error);
    throw error;
  }
};


// Logout service
export const logout = async () => {
  try {
    await AsyncStorage.removeItem('accessToken');
  } catch (error) {
    console.error('Logout error:', error.message);
    throw new Error('Failed to log out');
  }
};

// Get user profile
export const getUserDetails = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/user/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw new Error('Failed to fetch user details');
  }
};

// Handle 401 globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized! Token might be expired.');
      // Optionally handle re-auth or navigation here
    }
    return Promise.reject(error);
  }
);
