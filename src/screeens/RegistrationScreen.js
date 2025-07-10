import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Image, Alert, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getBaseUrl } from '../utils/sharesUtils';

const RegisterScreen = () => {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading

  const handleRegister = async () => {
    // Validate fields are not empty
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    // Validate username (must contain both numbers and letters, at least 1 of each)
    const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,}$/;
    if (!usernameRegex.test(username)) {
      Alert.alert('Error', 'Username must contain both letters and numbers.');
      return;
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    // Validate password length (minimum 8 characters)
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long.');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    setLoading(true); // Set loading to true before making the request

    try {
      const response = await axios.post(`${getBaseUrl()}auth/registration/`, {
        username,
        email,
        password1: password,
        password2: confirmPassword,
      });

      if ( response.status === 204) {
        Alert.alert('Success', 'Registration successful! Please Activate account before Login.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong!');
      }
    } catch (error) {
      if (error.response) {
        const { username, password1, password2 } = error.response.data;
        let errorMessage = '';

        if (username) errorMessage += `${username.join(' ')}\n`;
        if (password1) errorMessage += `${password1.join(' ')}\n`;
        if (password2) errorMessage += `${password2.join(' ')}\n`;

        Alert.alert('Error', errorMessage || 'Registration failed.');
      } else {
        Alert.alert('Error', 'Failed to register. Please try again later.');
      }
    } finally {
      setLoading(false); // Set loading to false once the request finishes
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Yourself</Text>

      <Image source={require('../../assets/Reg.png')} style={styles.logo} />

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor="#888"
      />

      {/* Show loading spinner if loading is true */}
      {loading ? (
        <ActivityIndicator size="large" color="#72bf6a" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signInText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#44923c',
    textAlign: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    borderColor: '#349B5F', // Border color to match theme
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    alignSelf: 'flex-start',
    marginLeft: '10%',
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: '#333',
  },
  button: {
    width: '80%',
    backgroundColor: '#72bf6a',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInText: {
    textAlign: 'center',
    color: '#6200ea',
    fontSize: 16,
    marginBottom: 20,
  },
});

export default RegisterScreen;
