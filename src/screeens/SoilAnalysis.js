import React, { useContext, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from "react-native";
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';
import { BASE_URL } from '../utils/sharesUtils';
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const SoilAnalysis = () => {
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const { user, userToken } = useContext(AuthContext);

    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted" || galleryStatus !== "granted") {
            Alert.alert("Permission denied. Please enable camera and gallery permissions.");
            return false;
        }
        return true;
    };

    const pickImageFromGallery = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
            analyzeSoil(uri);
        }
    };

    const takeImageWithCamera = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImageUri(uri);
            analyzeSoil(uri);
        }
    };

    const analyzeSoil = async (uri) => {
      setLoading(true);
      try {
          const base64 = await FileSystem.readAsStringAsync(uri, {
              encoding: FileSystem.EncodingType.Base64,
          });
  
          const response = await axios.post(
              `${BASE_URL}soilanalysis/`,
              {
                  inputImage: base64, // No "data:image/jpeg;base64," prefix
              },
              {
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Token ${userToken}`,
                  },
              }
          );
  
          // Django returns the final response after calling Flask and saving to DB
          setAnalysisResult(response.data);
      } catch (error) {
          Alert.alert("Error", "Soil analysis failed.");
          console.error("Soil analysis error:", error.response?.data || error.message);
      } finally {
          setLoading(false);
      }
  };
  

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Soil Analysis</Text>

            <TouchableOpacity style={styles.takePhotoButton} onPress={takeImageWithCamera}>
                <Feather name="camera" size={20} color="#fff" />
                <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadPhotoButton} onPress={pickImageFromGallery}>
                <Feather name="upload" size={20} color="#555" />
                <Text style={styles.uploadText}>Upload Photo</Text>
            </TouchableOpacity>

            {loading && <Text style={styles.loadingText}>Analyzing...</Text>}

            {analysisResult && !loading && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>Analysis Result:</Text>

                    <Text style={styles.resultContent}>
                        <Text style={styles.bold}>Phosphorus (P): </Text>
                        {analysisResult.P} ds/m
                    </Text>

                    <Text style={styles.resultContent}>
                        <Text style={styles.bold}>pH: </Text>
                        {analysisResult.pH}
                    </Text>

                    <Text style={styles.resultContent}>
                        <Text style={styles.bold}>Organic Matter (OM): </Text>
                        {analysisResult.OM} mg/kg
                    </Text>

                    <Text style={styles.resultContent}>
                        <Text style={styles.bold}>Electrical Conductivity (EC): </Text>
                        {analysisResult.EC} µS/cm
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        padding: 20,
        alignItems: "center",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 20,
    },
    takePhotoButton: {
        backgroundColor: "#007BFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        borderRadius: 5,
        width: 250,
        marginBottom: 10,
    },
    uploadPhotoButton: {
        backgroundColor: "#E0E0E0",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        borderRadius: 5,
        width: 250,
        marginBottom: 20,
    },
    buttonText: {
        color: "#FFF",
        fontWeight: "bold",
        marginLeft: 5,
    },
    uploadText: {
        color: "#555",
        fontWeight: "bold",
        marginLeft: 5,
    },
    loadingText: {
        fontSize: 16,
        color: "#FF5733",
        marginTop: 10,
    },
    resultContainer: {
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 5,
        width: "100%",
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    resultText: {
        fontWeight: "bold",
        marginBottom: 5,
    },
    resultContent: {
        fontSize: 14,
        color: "#555",
        marginBottom: 8,
    },
    bold: {
        fontWeight: "bold",
    },
});

export default SoilAnalysis;
