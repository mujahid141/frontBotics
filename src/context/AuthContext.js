import React, { createContext, useState, useEffect } from 'react';
import { loginUser as loginUser } from '../services/authService';
import { getUserDetails } from '../services/userService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initBaseUrl } from '../utils/sharesUtils'; // <- Make sure this sets the base URL properly

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Wait for token + baseURL
  const [userLoading, setUserLoading] = useState(false);

  // ✅ Login function
  const login = async (username, password) => {
    try {
      const data = await loginUser(username, password);
      if (data && typeof data.key === 'string') {
        console.log('✅ Received token:', data.key);
        setUserToken(data.key);
        await AsyncStorage.setItem('accessToken', data.key);
        await fetchUserDetails(data.key); // ✅ Fetch user after login
      } else {
        throw new Error('Login failed: Invalid token format.');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    setUserToken(null);
    setUser(null);
  };

  // ✅ Fetch user profile from token
  const fetchUserDetails = async (token) => {
    setUserLoading(true);
    try {
      const userDetails = await getUserDetails(token);
      setUser(userDetails);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setUserLoading(false);
    }
  };

  // ✅ On app load: init base URL, get token, and fetch user
  useEffect(() => {
    const bootstrap = async () => {
      try {
        await initBaseUrl(); // Set BASE_URL first
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          setUserToken(token);
          await fetchUserDetails(token); // Fetch user after setting base URL
        }
      } catch (err) {
        console.error('❌ Error during init:', err);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []); // ✅ Only run once

  // ✅ Optional loader UI (to avoid white screen)
  if (loading || userLoading) {
    return null;
    // Or return a spinner:
    // return (
    //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //     <ActivityIndicator size="large" color="#28a745" />
    //   </View>
    // );
  }

  return (
    <AuthContext.Provider value={{ user, userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
