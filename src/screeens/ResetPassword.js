import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { getBaseUrl } from '../utils/sharesUtils';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const loadEmail = async () => {
            const storedEmail = await AsyncStorage.getItem('reset_email');
            if (storedEmail) {
                setEmail(storedEmail);
            } else {
                Alert.alert('Error', 'No email found. Please request a reset again.');
                navigation.navigate('ForgotPassword');
            }
        };
        loadEmail();
    }, []);

    const handleVerifyOTP = async () => {
        if (!otp.trim()) {
            Alert.alert('Error', 'Please enter the OTP sent to your email.');
            return;
        }

        try {
            const response = await axios.post(`${getBaseUrl()}profile/password-reset/verify/`, {
                email,
                otp:String(otp),
            });

            if (response.status === 200) {
                await AsyncStorage.setItem('reset_otp', otp);
                Alert.alert('Success', 'OTP verified. You can now reset your password.');
                navigation.navigate('PasswordConfirm'); // move to password screen
            }
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.detail || 'Invalid OTP. Please try again.';
            Alert.alert('Verification Failed', errorMsg);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify OTP</Text>
            <Image source={require('../../assets/forgotlogo.png')} style={styles.logo} />
            <Text style={styles.label}>Email: {email}</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                placeholderTextColor="#888"
            />

            <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
                <Text style={styles.buttonText}>Verify OTP</Text>
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
    label: {
        fontSize: 14,
        color: '#555',
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

export default ResetPassword;
