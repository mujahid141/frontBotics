import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getBaseUrl, initBaseUrl } from '../utils/sharesUtils';
import Icon from 'react-native-vector-icons/Ionicons';

export default function IpInputScreen() {
  const [url, setUrl] = useState('');
  const navigation = useNavigation();

  // ✅ Validate HTTP/HTTPS URL
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
      await initBaseUrl();

      const baseUrl = await getBaseUrl();
      if (!baseUrl) {
        Alert.alert("Error", "Failed to initialize base URL.");
        return;
      }

      Alert.alert("Success", "URL saved successfully.");
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error saving URL:', error);
      Alert.alert("Error", "Something went wrong while saving the URL.");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top Icon */}
      <View style={styles.iconContainer}>
        <Icon name="link-outline" size={60} color="#2E7D32" />
      </View>

      {/* Title & Subtitle */}
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.subtitle}>
        Please enter the full server URL provided by your administrator.
      </Text>

      {/* Input */}
      <View style={styles.inputContainer}>
        <Icon name="earth-outline" size={20} color="#777" style={{ marginRight: 8 }} />
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
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.button} onPress={handleSave} activeOpacity={0.9}>
        <Text style={styles.buttonText}>Save & Continue</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8f5',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E7D32',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#4CAF50',
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
