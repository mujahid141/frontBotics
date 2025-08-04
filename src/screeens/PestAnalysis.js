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
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { getBaseUrl } from "../utils/sharesUtils";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const PestAnalysis = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { userToken } = useContext(AuthContext);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: galleryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted" || galleryStatus !== "granted") {
      Alert.alert(
        "Permission denied",
        "Please enable camera and gallery permissions."
      );
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

    if (!result.canceled) {
      analyzePest(result.assets[0].uri);
    }
  };

  const takeImageWithCamera = async () => {
    if (!(await requestPermissions())) return;

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      analyzePest(result.assets[0].uri);
    }
  };

  const analyzePest = async (imageUri) => {
    setLoading(true);
    try {
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await axios.post(
        `${getBaseUrl()}pestanddisease/`,
        { image: base64Image },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${userToken}`,
          },
        }
      );
      setAnalysisResult(response.data);
    } catch (error) {
      Alert.alert("Error", "Pest analysis failed.");
      console.error(
        "Error analyzing pest:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/chat.jpeg")}
      style={{ flex: 1 }}
      imageStyle={{ opacity: 0.20 }}
    >
      <View style={styles.container}>
        <Text style={styles.header}>🐛 Pest & Disease Analysis</Text>

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
              <Text style={styles.resultLabel}>Predicted Disease:</Text>
              <Text style={styles.resultValue}>
                {analysisResult.predicted_class || "No result"}
              </Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Confidence:</Text>
              <Text style={styles.resultValue}>
                {analysisResult.confidence || "No result"}%
              </Text>
            </View>

            {analysisResult.description && (
              <View style={styles.resultBlock}>
                <Text style={styles.resultLabel}>Description:</Text>
                <Text style={styles.resultValue}>{analysisResult.description}</Text>
              </View>
            )}

            {analysisResult.care && (
              <View style={styles.resultBlock}>
                <Text style={styles.resultLabel}>Care:</Text>
                <Text style={styles.resultValue}>{analysisResult.care}</Text>
              </View>
            )}

            {analysisResult.treatment && (
              <View style={styles.resultBlock}>
                <Text style={styles.resultLabel}>Treatment:</Text>
                <Text style={styles.resultValue}>{analysisResult.treatment}</Text>
              </View>
            )}

            {analysisResult.recommended_pesticides_or_fungicides?.length > 0 && (
              <View style={styles.resultBlock}>
                <Text style={styles.resultLabel}>
                  Recommended Pesticides/Fungicides:
                </Text>
                <Text style={styles.resultValue}>
                  {analysisResult.recommended_pesticides_or_fungicides.join(", ")}
                </Text>
              </View>
            )}
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
  resultBlock: {
    marginTop: 10,
  },
  resultLabel: {
    fontWeight: "bold",
    color: "#555",
  },
  resultValue: {
    color: "#333",
    marginTop: 2,
  },
});

export default PestAnalysis;
