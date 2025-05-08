import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../config/apiConfig';

const ResetPassword = () => {
    const [token, setToken] = useState('');
    const [base64, setBase64] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const navigation = useNavigation();

    const handleResetPassword = async () => {
        if (!token || !base64 || !password || !password2) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        if (password !== password2) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}auth/password/reset/confirm/${base64}/${token}`, {
                new_password1: password,
                new_password2: password2,
                uid: base64,
                token,
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            );

            if (response.status === 200) {
                Alert.alert('Success', 'Password has been updated.');
                navigation.navigate('Login');
            }
        } catch (error) {
            console.error(error); // For debugging purposes
            const errorMessage = error.response?.data?.detail || 'Failed to reset password. Please try again later.';
            Alert.alert('Reset Failed', errorMessage);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Password?</Text>
            <Image source={require('../../assets/forgotlogo.png')} style={styles.logo} />

            <TextInput
                style={styles.input}
                placeholder="Token"
                value={token}
                onChangeText={setToken}
                placeholderTextColor="#888"
            />
            <TextInput
                style={styles.input}
                placeholder="Id"
                value={base64}
                onChangeText={setBase64}
                placeholderTextColor="#888"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                placeholderTextColor="#888"
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={password2}
                onChangeText={setPassword2}
                secureTextEntry={true}
                placeholderTextColor="#888"
            />

            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signInText}>Back to Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#44923c',
        textAlign: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 120,
        height: 120,
    },
    input: {
        width: '80%',
        height: 50,
        backgroundColor: '#fff',
        marginTop: 25,
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        paddingHorizontal: 15,
        marginBottom: 20,
        color: '#333',
    },
    button: {
        width: '80%',
        backgroundColor: '#72bf6a',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signInText: {
        marginBottom: 20,
        color: '#6200ea',
        fontSize: 16,
    },
});

export default ResetPassword;
