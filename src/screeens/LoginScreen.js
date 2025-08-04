import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

// Email format checker
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }

    if (!isValidEmail(username)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      await login(username.trim(), password);
      Alert.alert('Success', 'Login successful');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    }
  };

  return (
   <ScrollView
  contentContainerStyle={{ flexGrow: 1 }}
  keyboardShouldPersistTaps="handled"
>
  
    <KeyboardAvoidingView 
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
  style={styles.container}
>

      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Login to continue to your farm</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#aaa"
      />
<View style={styles.passwordContainer}>
  <TextInput
    style={styles.passwordInput}
    placeholder="Enter Password"
    secureTextEntry={!showPassword}
    value={password}
    onChangeText={setPassword}
    placeholderTextColor="#aaa"
  />
  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
    <Text style={styles.toggleText}>
      {showPassword ? 'Hide' : 'Show'}
    </Text>
  </TouchableOpacity>
</View>


      <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.link}>Forgot password?</Text>
      </TouchableOpacity>

      <View style={styles.footerLinks}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
          <Text style={[styles.link, styles.signupLink]}> Sign Up</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('IpInput')}>
        <Text style={styles.linkSmall}>Set IP Address</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  passwordContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: 12,
  borderColor: '#ddd',
  borderWidth: 1,
  paddingHorizontal: 10,
  marginBottom: 15,
  elevation: 2,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 3,
  width: '100%',
  height: 50,
  marginTop: 10,
  justifyContent: 'space-between',
},
passwordInput: {
  flex: 1,
  height: 50,
  color: '#333',
},
toggleText: {
  color: '#1b5e20',
  fontWeight: 'bold',
  paddingHorizontal: 8,
},

  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    borderRadius: 70,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#333',
    elevation: 2,
  },
  button: {
    width: '100%',
    backgroundColor: '#43a047',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    color: '#1b5e20',
    fontSize: 16,
    marginTop: 5,
  },
  signupLink: {
    fontWeight: 'bold',
  },
  linkSmall: {
    textAlign: 'center',
    color: '#1b5e20',
    fontSize: 14,
    marginTop: 15,
  },
  footerLinks: {
    flexDirection: 'row',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#555',
  },
});

export default LoginScreen;
