import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getBaseUrl } from '../utils/sharesUtils';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { initBaseUrl } from '../utils/sharesUtils';
export default function IpInputScreen(
  
) {
  const [ip, setIp] = useState('');
  const navigation = useNavigation();
  const handleSave = async () => {
    if (!ip) {
      Alert.alert("Missing IP", "Please enter the IP address provided by your admin.");
      return;
    }

    await AsyncStorage.setItem('user_ip', ip);
    console.log('IP saved:', ip);
    initBaseUrl();
    initBaseUrl();
    console.log('IP saved:', getBaseUrl());
    Alert.alert("IP Saved", "The IP address has been saved successfully.");
    navigation.navigate('Login'); // Navigate to Login screen after saving IP
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
    backgroundColor: '#28a745', // Green button
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
});
