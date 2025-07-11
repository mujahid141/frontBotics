import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            if (username === '' || password === '') {
                Alert.alert('Error', 'Please enter both username and password');
                return;
            }

            await login(username, password);
            navigation.navigate('Home');
            Alert.alert('Success', 'Login successful');
        } catch (error) {
            Alert.alert('Login Failed', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back!</Text>

            <Image source={require('../../assets/logo.png')} style={styles.logo} />

            <TextInput
                style={styles.input}
                placeholder="Enter Email"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#aaa"
            />

            <TextInput
                style={styles.input}
                placeholder="Enter Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#aaa"
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>

      
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPassword}>Forgot password? Click here!</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('IpInput')}>
        <Text style={styles.forgotPassword}>Set Ip Here</Text>
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'linear-gradient(to bottom, #E8F0FF, #A9C9FF)', // Light gradient effect
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#44923c',
        textAlign: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 120,            // Reduced width for a smaller logo size
        height: 120,           // Reduced height for a smaller logo size
        resizeMode: 'contain',
        borderRadius: 60,      // Makes the logo round (half of width/height)
        marginBottom: 30,
    },
    
    label: {
        fontSize: 16,
        color: '#333',
        alignSelf: 'flex-start',
        marginBottom: 10,
        fontFamily: 'serif' // Added a font family
    },
    input: {
        height: 50,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        paddingHorizontal: 15,
        marginBottom: 15,
        color: '#333',
    },
    button: {
        width: '100%',
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
    signupText: {
        textAlign: 'center',
        color: '#6200ea',
        fontSize: 16,
    },

    forgotPassword: {
        textAlign: 'center',
        color: '#6200ea',
        fontSize: 16,
        paddingTop: 10,
       
    },
});

export default LoginScreen;
