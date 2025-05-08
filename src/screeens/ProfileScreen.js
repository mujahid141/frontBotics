import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext'; 
import { BASE_URL } from '../config/apiConfig';
import { MaterialIcons } from '@expo/vector-icons';

const ProfileEditScreen = () => {
  const { user } = useContext(AuthContext); // Retrieve token and userId from context
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
    <View style={styles.container}>
      <View style={styles.profileHeader}>
       
        <Text style={styles.username}>{userDetails.username}</Text>
        <TouchableOpacity onPress={handleEditToggle}>
          <MaterialIcons name={isEditing ? 'check' : 'edit'} size={30} color="#fff" style={styles.editIcon} />
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <View style={styles.formContainer}>
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
            <Text style={styles.buttonText}>Save</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#007BFF',
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  editIcon: {
    position: 'absolute',
    right: -12,
    top: -40,
    backgroundColor: '#007BFF',
    padding: 12,
    
    borderRadius: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  input: {
    height: 45,
    borderColor: '#007BFF',
    borderWidth: 1.5,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  detailItem: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: '#555',
  },
});

export default ProfileEditScreen;
