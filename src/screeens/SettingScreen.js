import React, { useContext } from "react";
import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/Ionicons";

const SettingsScreen = ({ navigation }) => {
    const { user, logout } = useContext(AuthContext);

    const MenuButton = ({ icon, label, color, onPress }) => (
        <TouchableOpacity style={styles.menuButton} onPress={onPress} activeOpacity={0.8}>
            <View style={[styles.iconCircle, { backgroundColor: color }]}>
                <Icon name={icon} size={22} color="#fff" />
            </View>
            <Text style={styles.menuText}>{label}</Text>
            <Icon name="chevron-forward" size={20} color="#aaa" />
        </TouchableOpacity>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Icon name="settings-outline" size={30} color="#2E7D32" />
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            {/* Welcome */}
            {user && (
                <Text style={styles.welcomeText}>
                    Welcome, <Text style={styles.username}>{user.username}</Text>!
                </Text>
            )}

            {/* Menu Options */}
            <MenuButton
                icon="person-outline"
                label="Profile Settings"
                color="#4CAF50"
                onPress={() => navigation.navigate("Profile")}
            />
            <MenuButton
                icon="notifications-outline"
                label="Notifications"
                color="#2196F3"
                onPress={() => navigation.navigate("Notification")}
            />
            <MenuButton
                icon="shield-checkmark-outline"
                label="Privacy & Security"
                color="#FF9800"
                onPress={() => navigation.navigate("privacyAndSecurity")}
            />
            <MenuButton
                icon="help-circle-outline"
                label="Help & Support"
                color="#9C27B0"
                onPress={() => navigation.navigate("HelpAndSupport")}
            />
            <MenuButton
                icon="settings-outline"
                label="Set IP"
                color="#607D8B"
                onPress={() => navigation.navigate("IpInputLoggedIn")}
            />

            {/* Logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.9}>
                <Icon name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f0f8f5",
        flexGrow: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        marginLeft: 10,
        color: "#2E7D32",
    },
    welcomeText: {
        fontSize: 16,
        color: "#555",
        marginBottom: 20,
    },
    username: {
        fontWeight: "bold",
        color: "#2E7D32",
    },
    menuButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    logoutButton: {
        flexDirection: "row",
        backgroundColor: "#e53935",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    logoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default SettingsScreen;
