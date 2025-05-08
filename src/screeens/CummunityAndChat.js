import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../utils/sharesUtils"; // Replace with your actual base URL

const CommunityAndChat = ({ navigation }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const getRooms = async () => {
    try {
      const response = await axios.get(`${BASE_URL}community/rooms/`);
      setRooms(response.data); // Adjust based on the response structure
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Community and Chat</Text>
      {user && <Text style={styles.welcome}>Welcome, {user.username}!</Text>}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : rooms.length > 0 ? (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id.toString()} // Assuming each room has a unique `id`
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.roomItem}
              onPress={() => navigation.navigate("ChatBox", { roomId: item.id })}
            >
              <Text style={styles.roomName}>{item.name}</Text>
              <Text style={styles.roomDescription}>
                {item.description || "Join the conversation!"}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noRoomsText}>No rooms available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 20,
    textAlign: "center",
  },
  welcome: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
  },
  roomItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  roomName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  roomDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  noRoomsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});

export default CommunityAndChat;
  