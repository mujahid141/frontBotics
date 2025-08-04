import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getBaseUrl } from '../utils/sharesUtils';
import Icon from 'react-native-vector-icons/Ionicons';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,}$/;
    if (!usernameRegex.test(username)) {
      Alert.alert('Invalid Username', 'Username must contain both letters and numbers.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Weak Password', 'Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${getBaseUrl()}auth/registration/`, {
        username,
        email,
        password1: password,
        password2: confirmPassword,
      });

      if (response.status === 200 || response.status === 204) {
        Alert.alert('Success', 'Registration successful! Please verify your email before logging in.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      if (error.response?.data) {
        const { username, password1, password2, email } = error.response.data;
        let message = '';

        if (email) message += `Email: ${email.join(', ')}\n`;
        if (username) message += `Username: ${username.join(', ')}\n`;
        if (password1) message += `Password: ${password1.join(', ')}\n`;
        if (password2) message += `Confirm Password: ${password2.join(', ')}\n`;

        Alert.alert('Registration Error', message || 'Failed to register.');
      } else {
        Alert.alert('Network Error', 'Please check your internet connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={require('../../assets/Reg.png')} style={styles.logo} />
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subText}>Join us and manage your farm smarter with AI tools.</Text>

        {/* Username */}
        <View style={styles.inputContainer}>
          <Icon name="person-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="Username (letters & numbers)"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
            placeholderTextColor="#888"
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#888"
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="Password (min 8 characters)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#888"
          />
        </View>

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#888"
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#72bf6a" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signInText}>
            Already have an account? <Text style={{ color: '#44923c', fontWeight: '600' }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc' },
  content: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 50,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputContainer: {
    width: '90%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 15,
  },
  button: {
    width: '90%',
    backgroundColor: '#72bf6a',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  signInText: {
    marginTop: 20,
    fontSize: 15,
    color: '#6200ea',
    textAlign: 'center',
  },
});

export default RegisterScreen;
