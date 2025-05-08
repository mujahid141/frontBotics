import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../utils/sharesUtils';
// Set default axios config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000, // Timeout set to 5 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Login service
export const login = async (username, password) => {
  try {
    // Log the attempt to log in
    console.log(BASE_URL)
    console.log('Attempting login with:', { username, password });

    const response = await apiClient.post('auth/login/', { username, password });

    // Log the successful response
    console.log('Login response:', response.data);

    const { key } = response.data; // Assuming the access token is returned as 'key'

    // Store the access token in AsyncStorage
    await AsyncStorage.setItem('accessToken', key);

    return response.data; // Return the response data for further handling
  } catch (error) {
    // Log error details
    if (error.response) {
      console.error('Login error status:', error.response.status);
      console.error('Login error details:', error.response.data);
    } else {
      console.error('Login error message:', error.message);
    }
    throw new Error('Login failed. Please check your credentials and API settings.');
  }
};

// Logout service
export const logout = async () => {
  try {
    // Remove the access token from AsyncStorage
    await AsyncStorage.removeItem('accessToken');
  } catch (error) {
    console.error('Logout error:', error.message);
    throw new Error('Failed to log out');
  }
};

export const getUserDetails = async (token) => {
  try {
      const response = await axios.get(`${BASE_URL}/users/profile/`, {
          headers: {
              'Authorization': `Bearer ${token}`,
          },
      });
      return response.data; // Return the user data
  } catch (error) {
      console.error('Error fetching user details:', error);
      throw new Error('Failed to fetch user details');
  }
};

// Example of handling token expiry in API calls
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized! Token might be expired.'); 
      // Handle the expired token scenario (e.g., redirect to login)
    }
    return Promise.reject(error);
  }
);
