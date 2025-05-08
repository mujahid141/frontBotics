import React, { createContext, useState, useEffect } from 'react';
import { loginUser as loginUser } from '../services/authService'; // Import the login function
import { getUserDetails } from '../services/userService'; // Import the service to fetch user details
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [user, setUser] = useState(null); // State to store user details
    const [loading, setLoading] = useState(true); // Loading state for checking token
    const [userLoading, setUserLoading] = useState(false); // Loading state for user data

    // Function to login the user
    const login = async (username, password) => {
        try {
          const data = await loginUser(username, password); // Call login from authService
      
          if (data && typeof data.key === 'string') {
            console.log('✅ Received token:', data.key);
            setUserToken(data.key); // Set the access token
            await AsyncStorage.setItem('accessToken', data.key); // Store access token
          } else {
            console.error('❌ Invalid login response:', data);
            throw new Error('Login failed: Invalid token format.');
          }
        } catch (error) {
          console.error('Login error:', error);
          throw new Error('Login failed. Please check your credentials.');
        }
      };
      
    // Function to logout the user
    const logout = async () => {
        await AsyncStorage.removeItem('accessToken'); // Remove access token from AsyncStorage
        setUserToken(null); // Clear user token
        setUser(null); // Clear user details
    };

    // Function to load token from AsyncStorage
    const loadToken = async () => {
        const token = await AsyncStorage.getItem('accessToken'); // Retrieve access token
        setUserToken(token); // Set user token state
        setLoading(false); // Set loading to false after token retrieval
    };

    // Function to fetch user details using the token
    const fetchUserDetails = async (token) => {
        setUserLoading(true); // Start loading user details
        try {
            const userDetails = await getUserDetails(token); // Call the service to fetch user details
            setUser(userDetails); // Set user data in state
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setUserLoading(false); // Stop loading user details
        }
    };

    // Fetch the user details on app start if token exists
    useEffect(() => {
        loadToken(); // Load token on app start
    }, []);

    // Fetch user details if userToken is updated
    useEffect(() => {
        if (userToken) {
            fetchUserDetails(userToken); // Fetch user details if the token is available
        }
    }, [userToken]);

    if (loading || userLoading) {
        return null; // Render nothing or a loader until token and user data are loaded
    }

    return (
        <AuthContext.Provider value={{ user, userToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
