import React, { useContext, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ImageBackground
} from "react-native";
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import { getBaseUrl } from '../utils/sharesUtils';
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const SoilAnalysis = ({ navigation }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userToken } = useContext(AuthContext);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted" || galleryStatus !== "granted") {
      Alert.alert("Permission denied", "Please enable camera and gallery permissions.");
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    if (!(await requestPermissions())) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      analyzeSoil(result.assets[0].uri);
    }
  };

  const takeImageWithCamera = async () => {
    if (!(await requestPermissions())) return;

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      analyzeSoil(result.assets[0].uri);
    }
  };

  const analyzeSoil = async (uri) => {
    Alert.alert(
      "Reminder",
      "Please make sure to upload a soil image to get relevant and accurate results.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          onPress: async () => {
            setLoading(true);
            try {
              const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
              });

              const response = await axios.post(
                `${getBaseUrl()}soilanalysis/`,
                { inputImage: base64 },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${userToken}`,
                  },
                }
              );

              setAnalysisResult(response.data);
            } catch (error) {
              Alert.alert("Error", "Soil analysis failed.");
              console.error("Soil analysis error:", error.response?.data || error.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/chat.jpeg")}
      style={{ flex: 1 }}
      imageStyle={{ opacity: 0.20 }}
    >
      <View style={styles.container}>
        <Text style={styles.header}>🌱 Soil Analysis</Text>

        <TouchableOpacity style={styles.takePhotoButton} onPress={takeImageWithCamera}>
          <Feather name="camera" size={20} color="#fff" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadPhotoButton} onPress={pickImageFromGallery}>
          <Feather name="upload" size={20} color="#2e7d32" />
          <Text style={styles.uploadText}>Upload Photo</Text>
        </TouchableOpacity>

        {loading && (
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={{ color: "#4CAF50", marginTop: 5 }}>Analyzing...</Text>
          </View>
        )}

        {analysisResult && !loading && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Analysis Result</Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Phosphorus (P):</Text>
              <Text style={styles.resultValue}>{analysisResult.P} ds/m</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>pH:</Text>
              <Text style={styles.resultValue}>{analysisResult.pH}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Organic Matter (OM):</Text>
              <Text style={styles.resultValue}>{analysisResult.OM} mg/kg</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Electrical Conductivity (EC):</Text>
              <Text style={styles.resultValue}>{analysisResult.EC} µS/cm</Text>
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    color: "#2e7d32",
    textAlign: "center",
  },
  takePhotoButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: 250,
    marginBottom: 10,
    elevation: 2,
  },
  uploadPhotoButton: {
    backgroundColor: "#E8F5E9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: 250,
    marginBottom: 20,
    elevation: 1,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
  uploadText: {
    color: "#2e7d32",
    fontWeight: "bold",
    marginLeft: 8,
  },
  resultContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  resultTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#2e7d32",
    marginBottom: 10,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  resultLabel: {
    fontWeight: "bold",
    color: "#555",
  },
  resultValue: {
    color: "#333",
  },
});

export default SoilAnalysis;
