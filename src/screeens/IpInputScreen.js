import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getBaseUrl, initBaseUrl } from '../utils/sharesUtils';

export default function IpInputScreen() {
  const [ip, setIp] = useState('');
  const navigation = useNavigation();

  // ✅ Regex to validate IP format (IPv4)
  const isValidIP = (ip) =>
    /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.|$)){4}$/.test(ip.trim());

  const handleSave = async () => {
    if (!ip) {
      Alert.alert("Missing IP", "Please enter the IP address.");
      return;
    }

    if (!isValidIP(ip)) {
      Alert.alert("Invalid IP", "Please enter a valid IP address (e.g. 192.168.1.100).");
      return;
    }

    try {
      await AsyncStorage.setItem('user_ip', ip.trim());

      await initBaseUrl(); // Load and store base URL from saved IP

      const baseUrl = await getBaseUrl();
      if (!baseUrl) {
        Alert.alert("Error", "Failed to initialize base URL.");
        return;
      }

      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving IP:', error);
      Alert.alert("Error", "Something went wrong while saving the IP.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.subtitle}>
        Please enter the server IP address provided to you by your system administrator.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. 192.168.1.100"
        value={ip}
        onChangeText={setIp}
        keyboardType="numeric"
        autoCapitalize="none"
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save & Continue</Text>
      </TouchableOpacity>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 24,
    color: '#000',
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    marginTop: 16,
    color: '#007bff',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
