import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBaseUrl } from '../utils/sharesUtils';

// Login service
export const loginUser = async (email, password) => {
  try {
    const baseURL = await getBaseUrl();

    const response = await axios.post(`${baseURL}auth/login/`, {
      email,
      password,
    });

    const { key } = response.data;

    if (key && typeof key === 'string') {
      console.log('🔐 Token from backend:', key);
      return { key };
    } else {
      console.error('❗ Invalid token format:', response.data);
      return null;
    }
  } catch (error) {
    console.error('❌ loginUser error:', error.message);
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
    const baseURL = await getBaseUrl();

    const response = await axios.get(`${baseURL}/auth/user/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    throw new Error('Failed to fetch user details');
  }
};
