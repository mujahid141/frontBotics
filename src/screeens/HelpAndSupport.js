import React, { useContext } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Linking, ScrollView } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialIcons";

const HelpAndSupport = () => {
    const { user } = useContext(AuthContext);

    const contactEmail = "support@farmbotic.com";
    const contactPhone = "+1234567890";
    const faqUrl = "https://www.farmbotic.com/faq";

    const openEmail = () => Linking.openURL(`mailto:${contactEmail}`);
    const callSupport = () => Linking.openURL(`tel:${contactPhone}`);
    const openFAQ = () => Linking.openURL(faqUrl);

    const Card = ({ icon, title, description, linkText, onPress }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
            <View style={styles.iconContainer}>
                <Icon name={icon} size={32} color="#4CAF50" />
            </View>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardDescription}>{description}</Text>
            {linkText && <Text style={styles.link}>{linkText}</Text>}
        </TouchableOpacity>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {user && <Text style={styles.welcomeText}>👋 Welcome, <Text style={styles.username}>{user.username}</Text>!</Text>}

            <Text style={styles.headerText}>Help & Support</Text>

            <Card
                icon="email"
                title="Contact Us"
                description="For support, email us at:"
                linkText={contactEmail}
                onPress={openEmail}
            />
            <Card
                icon="phone"
                title="Call Support"
                description="Reach out to us at:"
                linkText={contactPhone}
                onPress={callSupport}
            />
            <Card
                icon="help"
                title="FAQ"
                description="Find answers to common questions:"
                linkText="Visit FAQ"
                onPress={openFAQ}
            />
            <View style={[styles.card, { paddingVertical: 20 }]}>
                <View style={styles.iconContainer}>
                    <Icon name="info" size={32} color="#4CAF50" />
                </View>
                <Text style={styles.cardTitle}>About Farmbotic</Text>
                <Text style={styles.cardDescription}>
                    Farmbotic helps farmers enhance productivity through AI-powered solutions. 
                    For more details, visit our website or contact us directly.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#f0f8f5",
        padding: 20,
    },
    welcomeText: {
        fontSize: 18,
        color: "#2E7D32",
        marginBottom: 5,
        fontWeight: "500",
    },
    username: {
        fontWeight: "bold",
        color: "#1B5E20",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1B5E20",
        marginBottom: 20,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: "center",
    },
    iconContainer: {
        backgroundColor: "#E8F5E9",
        padding: 10,
        borderRadius: 50,
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    cardDescription: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 8,
    },
    link: {
        fontSize: 14,
        color: "#4CAF50",
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
});

export default HelpAndSupport;
