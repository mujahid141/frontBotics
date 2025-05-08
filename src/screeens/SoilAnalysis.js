import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ActivityIndicator, 
  Alert, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import axios from 'axios';
import { BASE_URL } from '../utils/sharesUtils';

const SoilAnalysis = () => {
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      setLoading(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true });
        setImageUri(photo.uri);

        Alert.alert(
          'Confirm',
          'Is this a soil image? Proceed with analysis?',
          [
            { text: 'Cancel', onPress: () => setLoading(false), style: 'cancel' },
            { text: 'Yes', onPress: () => analyzeSoil(photo.base64) },
          ]
        );
      } catch (err) {
        Alert.alert('Error', 'Unable to capture image.');
        setLoading(false);
      }
    }
  };

  const analyzeSoil = async (base64) => {
    try {
      const base64Only = base64.split(',').pop();
      const response = await axios.post(
        `${BASE_URL}soilanalysis/`,
        { inputImage: base64Only },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setAnalysisResult(response.data);
    } catch (err) {
      Alert.alert('Error', 'Soil analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImageUri(null);
    setAnalysisResult(null);
  };

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission required.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Soil Analysis</Text>

      {loading && <ActivityIndicator size="large" color="#4CAF50" />}

      {!imageUri && !analysisResult && (
        <CameraView style={styles.camera} ref={cameraRef}>
          <View style={styles.cameraButtonWrapper}>
            <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
              <Text style={styles.captureText}>Capture</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}

      {imageUri && !analysisResult && !loading && (
        <>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <TouchableOpacity style={styles.resetBtn} onPress={reset}>
            <Text style={styles.resetText}>Retake</Text>
          </TouchableOpacity>
        </>
      )}

      {analysisResult && (
        <View style={styles.resultBox}>
          <Text style={styles.resultHeader}>Results:</Text>
          <Text style={styles.resultItem}>Phosphorus (P): {analysisResult.P} ds/m</Text>
          <Text style={styles.resultItem}>pH: {analysisResult.pH}</Text>
          <Text style={styles.resultItem}>Organic Matter (OM): {analysisResult.OM} mg/kg</Text>
          <Text style={styles.resultItem}>Electrical Conductivity (EC): {analysisResult.EC} mole/l</Text>

          <TouchableOpacity style={styles.resetBtn} onPress={reset}>
            <Text style={styles.resetText}>Analyze Another</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#388e3c',
    textAlign: 'center',
    marginBottom: 10,
  },
  camera: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cameraButtonWrapper: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  captureBtn: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    width: 140,
    alignItems: 'center',
  },
  captureText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  resultBox: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  resultHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2e7d32',
    marginBottom: 8,
  },
  resultItem: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
  },
  resetBtn: {
    backgroundColor: '#ff7043',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  resetText: {
    color: '#fff',
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SoilAnalysis;
