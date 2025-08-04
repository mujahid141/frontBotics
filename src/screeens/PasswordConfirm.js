import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { getBaseUrl } from '../utils/sharesUtils';
import Icon from 'react-native-vector-icons/Ionicons';

const PasswordConfirm = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      const storedEmail = await AsyncStorage.getItem('reset_email');
      const storedOtp = await AsyncStorage.getItem('reset_otp');
      if (!storedEmail || !storedOtp) {
        Alert.alert('Error', 'Missing data. Please try the reset process again.');
        navigation.navigate('ForgotPassword');
        return;
      }
      setEmail(storedEmail);
      setOtp(storedOtp);
    };
    loadData();
  }, []);

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${getBaseUrl()}profile/password-reset/confirm/`, {
        email,
        otp: String(otp),
        new_password: newPassword
      });

      if (response.status === 200) {
        await AsyncStorage.multiRemove(['reset_email', 'reset_otp']);
        Alert.alert('Success', 'Your password has been updated.');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.detail || 'Failed to reset password.';
      Alert.alert('Reset Failed', errorMsg);
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
        <Image source={require('../../assets/forgotlogo.png')} style={styles.logo} />

        <Text style={styles.title}>Set New Password</Text>
        <Text style={styles.subtitle}>
          Your OTP has been verified. Please create a strong password for your account.
        </Text>

        {/* New Password Field */}
        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={true}
            placeholderTextColor="#888"
            style={styles.input}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Password</Text>
          )}
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signInText}>Back to Login</Text>
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
    width: 110,
    height: 110,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 25,
    textAlign: 'center',
    paddingHorizontal: 10,
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
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
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

export default PasswordConfirm;
