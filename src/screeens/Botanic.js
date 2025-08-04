import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import axios from 'axios';
import { getBaseUrl } from '../utils/sharesUtils';
import { AuthContext } from '../context/AuthContext';

const Botanic = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! 🌱 How can I assist you with your farm today?', sender: 'Botanic' },
  ]);
  const { userToken } = useContext(AuthContext);
  const [userInput, setUserInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollViewRef = useRef();

  const handleSend = async () => {
    const trimmedInput = userInput.trim();
    if (!trimmedInput || isThinking) return;

    const userMessage = { id: Math.random(), text: trimmedInput, sender: 'You' };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsThinking(true);

    const thinkingMessage = { id: Math.random(), text: 'Thinking...', sender: 'Botanic', isTemporary: true };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      const baseUrl = await getBaseUrl();
      if (!baseUrl || baseUrl.trim() === '') {
        throw new Error('Base URL is not set.');
      }

      const endpoint = `${baseUrl.replace(/\/+$/, '')}/bot/get_answer/`;

      const response = await axios.post(
        endpoint,
        { question: trimmedInput },
        {
          headers: {
            Authorization: `Token ${userToken}`,
          },
        }
      );

      setMessages(prev => prev.filter(msg => !msg.isTemporary));

      const botMessage = {
        id: Math.random(),
        text: response?.data?.answer || "🤔 Hmm... I couldn't come up with a response.",
        sender: 'Botanic',
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      setMessages(prev => prev.filter(msg => !msg.isTemporary));

      const errorMessage = {
        id: Math.random(),
        text: "⚠️ Sorry, something went wrong. Please try again with a valid farm-related question.",
        sender: 'Botanic',
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/chatbg.jpg')} // 🌿 a soft farm-themed or AI background image
      style={{ flex: 1 }}
      imageStyle={{ opacity: 0.20 }} // Low opacity for subtle effect
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <Text style={styles.header}>Botanic - AI Farm Assistant</Text>

        {/* Messages */}
        <ScrollView
          style={styles.messagesContainer}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
          keyboardShouldPersistTaps="handled"
        >
          {messages.map(message => (
            <View
              key={message.id}
              style={[
                styles.message,
                message.sender === 'You' ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text style={styles.sender}>{message.sender}</Text>
              <Text style={styles.text}>{message.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Ask me something about your farm..."
            placeholderTextColor="#888"
            editable={!isThinking}
          />
          <TouchableOpacity
  style={[styles.sendButton, isThinking && styles.disabledButton]}
  onPress={handleSend}
  disabled={isThinking}
>
  <Text style={styles.sendButtonText}>
    {isThinking ? '...' : 'Send'}
  </Text>
</TouchableOpacity>

        </View>

        {/* Thinking indicator */}
        {isThinking && (
          <View style={styles.thinkingContainer}>
            <ActivityIndicator size="small" color="#4CAF50" />
            <Text style={styles.thinkingText}>Botanic is thinking...</Text>
          </View>
        )}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  sendButton: {
  backgroundColor: '#4CAF50', // Green theme
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 25,
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 5,
  elevation: 2, // shadow for Android
  shadowColor: '#000', // shadow for iOS
  shadowOpacity: 0.2,
  shadowRadius: 3,
  shadowOffset: { width: 0, height: 2 },
},
sendButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},
disabledButton: {
  backgroundColor: '#ccc',
},

  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#2e7d32',
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    padding: 12,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userMessage: {
    backgroundColor: '#c8e6c9',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#fff8e1',
    alignSelf: 'flex-start',
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 3,
    fontSize: 12,
    color: '#666',
  },
  text: {
    fontSize: 15,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    marginBottom: 25,
  },
  input: {
    flex: 1,
    padding: 10,
    color: '#333',
  },
  thinkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    gap: 10,
  },
  thinkingText: {
    fontStyle: 'italic',
    color: '#999',
  },
});

export default Botanic;
