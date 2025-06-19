import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../utils/sharesUtils';

const PasswordConfirm = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
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

        try {
            const response = await axios.post(`${BASE_URL}profile/password-reset/confirm/`, {
                email,
                otp:String(otp),
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
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Set New Password</Text>
            <Image source={require('../../assets/forgotlogo.png')} style={styles.logo} />

            <TextInput
                style={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={true}
                placeholderTextColor="#888"
            />

            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>Submit</Text>
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
        marginBottom: 30,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 10,
    },
    input: {
        width: '80%',
        height: 50,
        backgroundColor: '#fff',
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

export default PasswordConfirm;
