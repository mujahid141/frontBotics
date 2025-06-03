import React, { useContext } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialIcons";

const Notifications = () => {
    const { user } = useContext(AuthContext);

    const notifications = [
        { id: "1", title: "New Message", description: "You have received a new message from Sarah.", time: "5 mins ago" },
        { id: "2", title: "Update Available", description: "A new update for your app is available.", time: "2 hours ago" },
        { id: "3", title: "Welcome Back!", description: "Thank you for logging in, enjoy your experience.", time: "1 day ago" },
    ];

    const renderNotification = ({ item }) => (
        <View style={styles.notificationCard}>
            <View style={styles.iconContainer}>
                <Icon name="notifications" size={24} color="#4CAF50" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.time}>{item.time}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {user && <Text style={styles.welcomeText}>Welcome, {user.username}!</Text>}

            <Text style={styles.headerText}>Notifications</Text>

            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderNotification}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        padding: 20,
    },
    welcomeText: {
        fontSize: 18,
        color: "#555",
        marginBottom: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    notificationCard: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
    },
    time: {
        fontSize: 12,
        color: "#AAA",
    },
});

export default Notifications;
