import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext'; 
import { BASE_URL } from '../utils/sharesUtils';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios'; // ✅ Correct import

const ProfileEditScreen = () => {
  const { user, userToken } = useContext(AuthContext); // ✅ Make sure token is provided in context
  const [userDetails, setUserDetails] = useState({});
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(user)
    if (user.pk) {
      fetchUserDetails();
    }
  }, [user.pk]);

  const fetchUserDetails = async () => {
    console.log(userToken)
    try {
      const response = await axios.get(`${BASE_URL}profile/`, {
        headers: {
          'Authorization': `Token ${userToken}`,
        }
      });
      const data = response.data;
      setUserDetails(data);
      setBio(data.bio || '');
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
      const response = await axios.put(`${BASE_URL}profile/`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${userToken}`,
        }
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
      Alert.alert('Error', 'Unable to update profile.');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handleEditToggle} style={styles.editIconContainer}>
          <MaterialIcons name={isEditing ? 'check' : 'edit'} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <View style={styles.formContainer}>
          <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
          <TextInput style={styles.input} placeholder="Bio" value={bio} onChangeText={setBio} />
          <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
          <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
          <TouchableOpacity onPress={handleSaveProfile} style={styles.button}>
            <Text style={styles.buttonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Email: <Text style={styles.info}>{user.email}</Text></Text>
          <Text style={styles.label}>Username: <Text style={styles.info}>{userDetails.username}</Text></Text>
          <Text style={styles.label}>Address: <Text style={styles.info}>{userDetails.address}</Text></Text>
          <Text style={styles.label}>Location: <Text style={styles.info}>{userDetails.location}</Text></Text>
          <Text style={styles.label}>Bio: <Text style={styles.info}>{userDetails.bio}</Text></Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  profileHeader: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 },
  editIconContainer: { backgroundColor: '#007AFF', padding: 8, borderRadius: 20 },
  formContainer: {},
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 5, borderRadius: 8 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center' },
  detailsContainer: {},
  label: { fontWeight: 'bold', marginTop: 10 },
  info: { fontWeight: 'normal' },
});

export default ProfileEditScreen;
