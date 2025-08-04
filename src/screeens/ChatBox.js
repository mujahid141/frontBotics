import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ImageBackground
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { getBaseUrl } from "../utils/sharesUtils";
import { Ionicons } from "@expo/vector-icons"; // for send icon

const ChatBox = () => {
  const route = useRoute();
  const { roomId } = route.params;
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const flatListRef = useRef();

  const getMessages = async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}community/rooms/${roomId}/messages/`);
      const sorted = response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(sorted);
      setRefreshing(false);
    } catch (error) {
      console.error("Fetch messages error:", error);
      setRefreshing(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await axios.post(`${getBaseUrl()}community/rooms/${roomId}/messages/`, {
        sender: user.pk,
        content: newMessage,
      });
      setNewMessage("");
      getMessages();
    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getMessages();
  };

  useEffect(() => {
    getMessages();
  }, [roomId]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const isCurrentUser = (sender) => {
    return sender === user?.username || sender === user?.pk;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const renderItem = ({ item }) => {
    const isUser = isCurrentUser(item.sender);

    return (
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text style={styles.senderName}>
          {isUser ? "You" : item.sender.substring(0, 10)} {/* Show first 10 chars of sender name */}
        </Text>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/chat.jpeg")}
      style={{ flex: 1 }}
      imageStyle={{ opacity: 0.25 }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <Text style={styles.header}>🌾 Community Chat</Text>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          inverted
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 10 }}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            onSubmitEditing={sendMessage}
            placeholderTextColor="#777"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#2e7d32",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: "75%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#c8e6c9",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#fff8e1",
  },
  senderName: {
    fontWeight: "bold",
    marginBottom: 3,
    fontSize: 12,
    color: "#666",
  },
  messageText: {
    fontSize: 15,
    color: "#333",
  },
  timestamp: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 5,
    backgroundColor: "#fff",
    borderRadius: 30,
    marginHorizontal: 5,
    marginBottom: Platform.OS === "ios" ? 10 : 25,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    elevation: 2,
  },
});

export default ChatBox;
