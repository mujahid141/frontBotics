import React, { useState } from 'react';
import { View, Image, Button, StyleSheet, Alert, Text } from 'react-native';
const qrCodeImage = require('../../assets/paymet_qr_code.jpg'); // Place your QR code image in src/assets/

const PaymentScreen = ({navigation}) => {
    const [confirmed, setConfirmed] = useState(false);

    const handleConfirm = () => {
        setConfirmed(true);
        Alert.alert('For Payment Confirmations please share the transaction ID with the admin.');
        navigation.navigate('PaymentConfirm'); // Navigate to Payment Confirmation screen
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Scan the QR Code to Pay</Text>
            <Image source={qrCodeImage} style={styles.qrImage} resizeMode="contain" />
            {!confirmed ? (
                <Button title="I have made the payment" onPress={handleConfirm} />
            ) : (
                <Text style={styles.confirmedText}>Payment Confirmed!</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        marginBottom: 24,
        fontWeight: 'bold',
    },
    qrImage: {
        width: 250,
        height: 250,
        marginBottom: 32,
    },
    confirmedText: {
        marginTop: 20,
        fontSize: 18,
        color: 'green',
        fontWeight: 'bold',
    },
});

export default PaymentScreen;