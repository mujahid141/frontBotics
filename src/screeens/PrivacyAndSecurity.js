import React, { useContext } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialIcons";

const PrivacyAndSecurity = () => {
    const { user } = useContext(AuthContext);

    const OptionButton = ({ icon, label, color, onPress }) => (
        <TouchableOpacity style={[styles.optionButton, { backgroundColor: color }]} onPress={onPress} activeOpacity={0.8}>
            <Icon name={icon} size={24} color="#fff" style={styles.optionIcon} />
            <Text style={styles.optionText}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image 
                source={require("../../assets/security.svg")} // ✅ Changed to PNG since RN doesn't support SVG by default
                style={styles.image} 
                resizeMode="contain"
            />
            <Text style={styles.headerText}>Privacy & Security</Text>
            <Text style={styles.subText}>
                Protect your account and ensure your data stays safe with our security features.
            </Text>
            
            {user && (
                <Text style={styles.welcomeText}>
                    👋 Hello, <Text style={styles.userName}>{user.username}</Text>!  
                    Review and update your security settings below.
                </Text>
            )}

            {/* Security Options */}
            <OptionButton 
                icon="privacy-tip" 
                label="Update Privacy Settings" 
                color="#4CAF50"
                onPress={() => console.log("Update Privacy Settings")}
            />
            <OptionButton 
                icon="security" 
                label="Review Security Logs" 
                color="#2196F3"
                onPress={() => console.log("Review Security Logs")}
            />
            <OptionButton 
                icon="verified-user" 
                label="Enable Two-Factor Authentication" 
                color="#FF9800"
                onPress={() => console.log("Enable 2FA")}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#f0f8f5",
        padding: 20,
        alignItems: "center",
    },
    image: {
        width: 140,
        height: 140,
        marginBottom: 15,
    },
    headerText: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#2E7D32",
        marginBottom: 8,
        textAlign: "center",
    },
    subText: {
        fontSize: 15,
        color: "#555",
        textAlign: "center",
        marginBottom: 20,
        lineHeight: 20,
    },
    welcomeText: {
        fontSize: 16,
        color: "#333",
        marginBottom: 20,
        textAlign: "center",
    },
    userName: {
        fontWeight: "bold",
        color: "#1B5E20",
    },
    optionButton: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 16,
        width: "100%",
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    optionIcon: {
        marginRight: 12,
    },
    optionText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default PrivacyAndSecurity;
