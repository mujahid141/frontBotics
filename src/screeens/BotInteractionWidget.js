import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const BotInteractionWidget = () => {
    const messages = [
        { type: 'user', text: 'Which crop should I plant this season?' },
        { type: 'bot', text: 'Based on your soil and weather data, Maize is a good choice.' },
        { type: 'user', text: 'How often should I irrigate the farm?' },
        { type: 'bot', text: 'Every 3 days during peak heat. Monitor soil moisture for accuracy.' },
    ];

    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4712/4712027.png' }}
                    style={styles.icon}
                />
                <Text style={styles.title}>Bot Interaction</Text>
            </View>

            <ScrollView style={styles.chatContainer} nestedScrollEnabled>
                {messages.map((msg, index) => (
                    <View
                        key={index}
                        style={[
                            styles.messageBubble,
                            msg.type === 'user' ? styles.userBubble : styles.botBubble,
                        ]}
                    >
                        <Text style={styles.messageText}>{msg.text}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        width: '100%',
        maxHeight: 280,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    icon: {
        width: 32,
        height: 32,
        marginRight: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5C6BC0',
    },
    chatContainer: {
        marginTop: 10,
    },
    messageBubble: {
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
        maxWidth: '90%',
    },
    userBubble: {
        backgroundColor: '#E8F5E9',
        alignSelf: 'flex-end',
    },
    botBubble: {
        backgroundColor: '#E3F2FD',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 14,
        color: '#333',
    },
});

export default BotInteractionWidget;
