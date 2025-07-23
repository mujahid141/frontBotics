import React, { useContext } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure you have react-native-vector-icons installed

const SettingsScreen = ({navigation}) => {
    const { user, logout } = useContext(AuthContext); // Access user and logout function

    return (
        <View style={styles.container}>
            {/* Settings Icon */}
            <TouchableOpacity style={styles.iconContainer}>
                <Icon name="settings-outline" size={30} color="#4CAF50" />
            </TouchableOpacity>

            {/* Welcome Message */}
            <Text style={styles.title}>Settings</Text>
            {user && <Text style={styles.welcomeText}>Welcome, {user.username}!</Text>}

            {/* Buttons */}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.buttonText}>Profile Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Notification')}>
                <Text style={styles.buttonText}>Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('privacyAndSecurity')}>
                <Text style={styles.buttonText}>Privacy & Security</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HelpAndSupport')}>
                <Text style={styles.buttonText}>Help & Support</Text>
            </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('IpInputLoggedIn')}>
                <Text style={styles.buttonText}>Set Ip</Text>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    iconContainer: {
        position: "absolute",
        top: 20,
        right: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 20,
    },
    welcomeText: {
        fontSize: 18,
        color: "#4CAF50",
        marginBottom: 30,
    },
    button: {
        width: "80%",
        padding: 15,
        backgroundColor: "#4CAF50",
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 8,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
    logoutButton: {
        width: "80%",
        padding: 15,
        backgroundColor: "#e53935",
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    logoutButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default SettingsScreen;
