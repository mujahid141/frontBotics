import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getBaseUrl } from '../utils/sharesUtils';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

const ProfileEditScreen = () => {
  const { user, userToken } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState({});
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.pk) {
      fetchUserDetails();
    }
  }, [user?.pk]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}profile/`, {
        headers: { Authorization: `Token ${userToken}` },
      });

      const data = response.data;
      setUserDetails(data);
      setUsername(data.username || '');
      setBio(data.bio || '');
      setLocation(data.location || '');
      setAddress(data.address || '');
    } catch (error) {
      console.error('Error fetching user details:', error);
      Alert.alert('Error', 'Unable to fetch user details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updatedData = { username, bio, location, address };
      const response = await axios.put(`${getBaseUrl()}profile/`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${userToken}`,
        },
      });

      if (response.status === 200 || response.status === 204) {
        Alert.alert('Success', 'Profile updated successfully!');
        setIsEditing(false);
        fetchUserDetails();
      } else {
        Alert.alert('Error', 'Unable to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Your Profile</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editButton}>
            <MaterialIcons name={isEditing ? 'close' : 'edit'} size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {isEditing ? (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Bio"
              value={bio}
              onChangeText={setBio}
            />
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.detailsBox}>
            <Text style={styles.detailLabel}>
              Email: <Text style={styles.detailValue}>{user?.email}</Text>
            </Text>
            <Text style={styles.detailLabel}>
              Username: <Text style={styles.detailValue}>{userDetails?.username || '—'}</Text>
            </Text>
            <Text style={styles.detailLabel}>
              Address: <Text style={styles.detailValue}>{userDetails?.address || '—'}</Text>
            </Text>
            <Text style={styles.detailLabel}>
              Location: <Text style={styles.detailValue}>{userDetails?.location || '—'}</Text>
            </Text>
            <Text style={styles.detailLabel}>
              Bio: <Text style={styles.detailValue}>{userDetails?.bio || '—'}</Text>
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fc' },
  scrollContent: { padding: 20 },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 20,
  },
  form: {},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 1,
  },
  detailLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10,
    color: '#333',
  },
  detailValue: {
    fontWeight: 'normal',
    color: '#555',
  },
});

export default ProfileEditScreen;
