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
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../utils/sharesUtils";

const ChatBox = () => {
  const route = useRoute();
  const { roomId } = route.params;
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const flatListRef = useRef();

  const getMessages = async () => {
    try {
      const response = await axios.get(`${BASE_URL}community/rooms/${roomId}/messages/`);
      const sorted = response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(sorted);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Fetch messages error:", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await axios.post(`${BASE_URL}community/rooms/${roomId}/messages/`, {
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
    const senderName = isUser ? "You"   : " ananomys ";

    return (
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text style={styles.senderName}>{item.sender}</Text>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.header}>🌿 Cummunity Chat</Text>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        inverted
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eafaf1",
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#2d6a4f",
  },
  messageBubble: {
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
    maxWidth: "75%",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#c7f9cc",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#b7e4c7",
  },
  senderName: {
    fontWeight: "bold",
    marginBottom: 3,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    color: "#555",
    marginTop: 4,
    textAlign: "right",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#2d6a4f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ChatBox;
