import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { getBaseUrl } from '../utils/sharesUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const [isDisabled, setIsDisabled] = useState(false);

  const handleResetPassword = async () => {
    setIsDisabled(true);

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email.');
      setIsDisabled(false);
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      setIsDisabled(false);
      return;
    }

    try {
      const response = await axios.post(
        `${getBaseUrl()}profile/password-reset/request/`,
        { email }
      );

      if (response.status === 200) {
        await AsyncStorage.setItem('reset_email', email);
        Alert.alert('Success', 'OTP has been sent to your email.');
        navigation.navigate('ResetPassword');
      }
    } catch (error) {
      if (error.response?.data?.detail) {
        Alert.alert('Error', error.response.data.detail);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Forgot Password?</Text>
      <Image
        source={require('../../assets/forgotlogo.png')}
        style={styles.logo}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        style={[styles.button, isDisabled && styles.disabledButton]}
        disabled={isDisabled}
        onPress={handleResetPassword}
      >
        <Text style={styles.buttonText}>
          {isDisabled ? 'Please wait...' : 'Get Reset OTP'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signInText}>Back to Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#44923c',
    textAlign: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: '#fff',
    marginTop: 25,
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
    marginBottom: 20,
    color: '#6200ea',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
