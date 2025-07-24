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
  const [url, setUrl] = useState('');
  const navigation = useNavigation();

  // ✅ Regex to validate HTTP/HTTPS URL
  const isValidUrl = (string) => {
    try {
      const parsed = new URL(string.trim());
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const handleSave = async () => {
    if (!url) {
      Alert.alert("Missing URL", "Please enter the server URL.");
      return;
    }

    if (!isValidUrl(url)) {
      Alert.alert("Invalid URL", "Please enter a valid URL (e.g. https://abc123.ngrok.io).");
      return;
    }

    try {
      await AsyncStorage.setItem('user_ip', url.trim());

      await initBaseUrl(); // Custom logic to initialize base URL from AsyncStorage

      const baseUrl = await getBaseUrl();
      if (!baseUrl) {
        Alert.alert("Error", "Failed to initialize base URL.");
        return;
      }

      navigation.navigate('Login');
      Alert.alert("Success", "URL saved successfully.");
    } catch (error) {
      console.error('Error saving URL:', error);
      Alert.alert("Error", "Something went wrong while saving the URL.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.subtitle}>
        Please enter the full server URL provided to you by your system administrator.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. https://abc123.ngrok.io"
        value={url}
        onChangeText={setUrl}
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
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
});
