import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext'; 
import { BASE_URL } from '../utils/sharesUtils';
import { MaterialIcons } from '@expo/vector-icons';

const ProfileEditScreen = () => {
  const { user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState(user);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user.id) {
      fetchUserDetails();
    }
  }, [user.id]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}users/profile/${user.id}/`);
      const data = await response.json();
      setUserDetails(data);
      setUsername(data.username);
      setBio(data.bio);
      setLocation(data.location);
      setAddress(data.address);
    } catch (error) {
      console.error('Error fetching user details:', error);
      Alert.alert('Error', 'Unable to fetch user details.');
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updatedData = { username, bio, location, address };
      const response = await fetch(`${BASE_URL}users/profile/${user.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully!');
        setIsEditing(false);
        fetchUserDetails();
      } else {
        Alert.alert('Error', 'Unable to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Unable to update profile.');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={styles.profileHeader}>
       
        <TouchableOpacity onPress={handleEditToggle} style={styles.editIconContainer}>
          <MaterialIcons name={isEditing ? 'check' : 'edit'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity onPress={handleSaveProfile} style={styles.button}>
            <Text style={styles.buttonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.info}>{user.email}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.info}>{user.username}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.info}>{userDetails.address}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Location:</Text>
            <Text style={styles.info}>{userDetails.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.label}>Bio:</Text>
            <Text style={styles.info}>{userDetails.bio}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    paddingHorizontal: 16,
  },
  profileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  editIconContainer: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    height: 50,
    borderColor: '#007BFF',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailItem: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
});

export default ProfileEditScreen;
