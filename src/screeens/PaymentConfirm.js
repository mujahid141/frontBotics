import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { getBaseUrl } from '../utils/sharesUtils';
import { AuthContext } from '../context/AuthContext';

const PaymentConfirm = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!transactionId.trim()) {
      Alert.alert('Error', 'Please enter a transaction ID.');
      return;
    }

    if (!amount || isNaN(amount)) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${getBaseUrl()}payment/payment-post/`,
        {
          transaction_id: transactionId,
          amount: amount,
        },
        {
          headers: {
            Authorization: `Token ${userToken}`,
          },
          timeout: 10000,
        }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', 'Transaction sent for admin approval.');
        setTransactionId('');
        setAmount('');
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error confirming transaction:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.formContainer}>
        <Icon name="card-outline" size={50} color="#2E7D32" style={{ marginBottom: 15 }} />
        <Text style={styles.header}>Payment Confirmation</Text>
        <Text style={styles.subText}>
          Please enter your payment details to complete the process.
        </Text>

        <Text style={styles.label}>Transaction ID</Text>
        <TextInput
          style={styles.input}
          value={transactionId}
          onChangeText={setTransactionId}
          placeholder="Enter transaction ID"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
          keyboardType="numeric"
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="checkmark-done-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.buttonText}>Submit</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8f5',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 6,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 15,
    marginBottom: 6,
    fontWeight: '600',
    color: '#333',
    alignSelf: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
    width: '100%',
    backgroundColor: '#fafafa',
    color: '#000',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default PaymentConfirm;
