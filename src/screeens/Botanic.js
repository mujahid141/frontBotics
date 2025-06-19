import React, { useState, useRef, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../utils/sharesUtils'; // Adjust path as needed
import { AuthContext } from '../context/AuthContext';

const Botanic = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I assist you with your farm today?', sender: 'Botanic' },
  ]);

  const { user, userToken } = useContext(AuthContext); // ✅ Make sure token is provided in context
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
  
    // Simulate delay
    setTimeout(async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}bot/get_answer/`,
          { question: trimmedInput }, // body data
          {
            headers: {
              'Authorization': `Token ${userToken}`,
            }
          }
        );
  
        // Remove temporary "thinking" message
        setMessages(prev => prev.filter(msg => !msg.isTemporary));
  
        const botMessage = {
          id: Math.random(),
          text: response.data.answer || "Hmm... I couldn't come up with a response.",
          sender: 'Botanic ',
        };
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        setMessages(prev => prev.filter(msg => !msg.isTemporary));
  
        const errorMessage = {
          id: Math.random(),
          text: "Sorry, Please ask something related to farming and Agriculture . Please try again later.",
          sender: 'Botanic',
        };
        setMessages(prev => [...prev, errorMessage]);
      }
  
      setIsThinking(false);
    }, 2000); // 2 second delay
  };
  

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.header}>Botanic - AI Farm Assistant</Text>

      <ScrollView 
        style={styles.messagesContainer}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Ask me something about your farm..."
          editable={!isThinking}
        />
        <Button title="Send" onPress={handleSend} disabled={isThinking} />
      </View>

      {isThinking && (
        <View style={styles.thinkingContainer}>
          <ActivityIndicator size="small" color="#4CAF50" />
          <Text style={styles.thinkingText}>Botanic is thinking...</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2e7d32',
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 10,
  },
  message: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#e0f2f1',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#fff3e0',
    alignSelf: 'flex-start',
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 3,
    fontSize: 12,
  },
  text: {
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
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
