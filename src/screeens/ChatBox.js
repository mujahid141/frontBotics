import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../utils/sharesUtils";

const ChatBox = () => {
  const route = useRoute();
  const { roomId } = route.params; // Get roomId from route params
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const getMessages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}community/rooms/${roomId}/messages/`);
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
  
    if (!newMessage.trim()) return; // Ensure the message isn't empty
  
    try {
      await axios.post(`${BASE_URL}community/rooms/${roomId}/messages/`, {
        sender: user.id, // Use "sender" as expected by the backend
        content: newMessage,
      });
  
      setNewMessage(""); // Clear the input field
      getMessages(); // Refresh the messages by fetching the latest ones
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    getMessages();
  }, [roomId]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.header}>Chat</Text>
      {user && <Text style={styles.welcome}>Welcome, {user.username}!</Text>}
      {loading ? (
        <Text>Loading messages...</Text>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.messageContainer}>
              <Text style={styles.sender}>{item.sender || "User"}:</Text>
              <Text style={styles.message}>{item.content}</Text>
            </View>
          )}
          inverted
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  welcome: { fontSize: 18, marginBottom: 20 },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#e1e1e1",
    borderRadius: 10,
  },
  sender: { fontWeight: "bold" },
  message: { fontSize: 16 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  sendButtonText: { color: "#fff", fontWeight: "bold" },
});

export default ChatBox;
