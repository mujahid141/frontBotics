import React, { useContext, useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { getBaseUrl } from "../utils/sharesUtils";

const CommunityAndChat = ({ navigation }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const getRooms = async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}community/rooms/`);
      setRooms(response.data);
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
    <ImageBackground
      source={require("../../assets/chat.jpeg")} // same soft background as Botanic
      style={styles.background}
      imageStyle={{ opacity: 0.20 }}
    >
      <View style={styles.container}>
        <Text style={styles.header}>🌾 Community and Chat</Text>
        {user && <Text style={styles.welcome}>Welcome, {user.username}!</Text>}

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
        ) : rooms.length > 0 ? (
          <FlatList
            data={rooms}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.roomCard}
                onPress={() => navigation.navigate("ChatBox", { roomId: item.id })}
                activeOpacity={0.85}
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2e7d32", // Green theme
    textAlign: "center",
    marginBottom: 10,
  },
  welcome: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 15,
  },
  roomCard: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50", // Accent border
  },
  roomName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2e7d32",
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
