import React, { useContext } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Linking, ScrollView } from "react-native";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialIcons";

const HelpAndSupport = () => {
    const { user } = useContext(AuthContext);

    const contactEmail = "support@farmbotic.com";
    const contactPhone = "+1234567890";
    const faqUrl = "https://www.farmbotic.com/faq";

    const openEmail = () => {
        Linking.openURL(`mailto:${contactEmail}`);
    };

    const callSupport = () => {
        Linking.openURL(`tel:${contactPhone}`);
    };

    const openFAQ = () => {
        Linking.openURL(faqUrl);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {user && <Text style={styles.welcomeText}>Welcome, {user.username}!</Text>}

            <Text style={styles.headerText}>Help & Support</Text>

            <View style={styles.card}>
                <Icon name="email" size={30} color="#4CAF50" style={styles.icon} />
                <Text style={styles.cardTitle}>Contact Us</Text>
                <Text style={styles.cardDescription}>For support, email us at:</Text>
                <TouchableOpacity onPress={openEmail}>
                    <Text style={styles.link}>{contactEmail}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Icon name="phone" size={30} color="#4CAF50" style={styles.icon} />
                <Text style={styles.cardTitle}>Call Support</Text>
                <Text style={styles.cardDescription}>Reach out to us at:</Text>
                <TouchableOpacity onPress={callSupport}>
                    <Text style={styles.link}>{contactPhone}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Icon name="help" size={30} color="#4CAF50" style={styles.icon} />
                <Text style={styles.cardTitle}>FAQ</Text>
                <Text style={styles.cardDescription}>Find answers to common questions:</Text>
                <TouchableOpacity onPress={openFAQ}>
                    <Text style={styles.link}>Visit FAQ</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <Icon name="info" size={30} color="#4CAF50" style={styles.icon} />
                <Text style={styles.cardTitle}>About Farmbotic</Text>
                <Text style={styles.cardDescription}>Farmbotic helps farmers enhance productivity through AI solutions. For more details, visit our website or contact us directly.</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
        textAlign: "center",
    },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        flexDirection: "column",
        alignItems: "center",
    },
    icon: {
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
        marginBottom: 10,
    },
    link: {
        fontSize: 14,
        color: "#4CAF50",
        textDecorationLine: "underline",
    },
});

export default HelpAndSupport;
