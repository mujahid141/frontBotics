import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const qrCodeImage = require('../../assets/paymet_qr_code.jpg'); // Your QR code image

const PaymentScreen = ({ navigation }) => {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    Alert.alert(
      'Payment Confirmation',
      'Please share your transaction ID with the admin for verification.'
    );
    navigation.navigate('PaymentConfirm');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Icon name="qr-code-outline" size={70} color="#2E7D32" style={{ marginBottom: 10 }} />
      <Text style={styles.title}>Scan the QR Code to Pay</Text>
      <Text style={styles.subtitle}>
        Use your preferred payment app to scan and complete the payment.
      </Text>

      {/* QR Code Box */}
      <View style={styles.qrBox}>
        <Image source={qrCodeImage} style={styles.qrImage} resizeMode="contain" />
      </View>

      {/* Action Button */}
      {!confirmed ? (
        <TouchableOpacity style={styles.button} onPress={handleConfirm} activeOpacity={0.85}>
          <Icon name="checkmark-done-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>I Have Made the Payment</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.confirmedText}>
          ✅ Payment Confirmation in Progress
        </Text>
      )}

      {/* Info */}
      <Text style={styles.infoText}>
        Your subscription will be activated after verification.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  qrBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 30,
  },
  qrImage: {
    width: 230,
    height: 230,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  confirmedText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#777',
    marginTop: 15,
    textAlign: 'center',
  },
});

export default PaymentScreen;
