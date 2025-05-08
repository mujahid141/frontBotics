import React, { useContext } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";

const PrivacyAndSecurity = () => {
    const { user } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Image 
                source={require("../../assets/security.svg")} 
                style={styles.image} 
                resizeMode="contain"
            />
            <Text style={styles.headerText}>Privacy and Security</Text>
            <Text style={styles.subText}>
                Protect your account and ensure your data remains secure.
            </Text>
            {user && (
                <Text style={styles.welcomeText}>
                    Hello, <Text style={styles.userName}>{user.name}</Text>! Review your security settings below.
                </Text>
            )}
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Update Privacy Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                    Review Security Logs
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.tertiaryButton]}>
                <Text style={[styles.buttonText, styles.tertiaryButtonText]}>
                    Enable Two-Factor Authentication
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        paddingHorizontal: 20,
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    headerText: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#2c3e50",
        marginBottom: 10,
    },
    subText: {
        fontSize: 16,
        color: "#7f8c8d",
        textAlign: "center",
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 18,
        color: "#34495e",
        marginBottom: 20,
        textAlign: "center",
    },
    userName: {
        fontWeight: "bold",
        color: "#2980b9",
    },
    button: {
        backgroundColor: "#3498db",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 10,
        width: "80%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    secondaryButton: {
        backgroundColor: "#ecf0f1",
    },
    secondaryButtonText: {
        color: "#34495e",
    },
    tertiaryButton: {
        backgroundColor: "#2ecc71",
    },
    tertiaryButtonText: {
        color: "#fff",
    },
});

export default PrivacyAndSecurity;
