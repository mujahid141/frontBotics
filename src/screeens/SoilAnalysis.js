import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import axios from 'axios';
import { BASE_URL } from '../utils/sharesUtils';

const SoilAnalysis = () => {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back); // Set default camera type
  const [analysisResult, setAnalysisResult] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      setImageUri(photo.uri);
      processImage(photo.base64);
    }
  };

  const processImage = async (base64Image) => {
    setLoading(true);
    try {
      const base64Only = base64Image.split(',').pop();
      console.log('Sending image data:', base64Only); // Debug log

      const response = await axios.post(
        `${BASE_URL}soil_analysis/predict/`,
        { inputImage: base64Only },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Response received:', response.data); // Debug log
      setAnalysisResult(response.data);
    } catch (error) {
      console.error('Error during image analysis:', error.message);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <TouchableOpacity onPress={() => Camera.requestCameraPermissionsAsync()}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Soil Health Analysis</Text>
      
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {loading && <ActivityIndicator size={50} color="#4CAF50" />}

      {analysisResult && (
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Phosphorus (P):</Text>
            <Text style={styles.tableData}>{analysisResult.P} ds/m</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>pH Level:</Text>
            <Text style={styles.tableData}>{analysisResult.pH}%</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Organic Matter (OM):</Text>
            <Text style={styles.tableData}>{analysisResult.OM} mg/kg</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Electrical Conductivity (EC):</Text>
            <Text style={styles.tableData}>{analysisResult.EC} mole/l</Text>
          </View>
        </View>
      )}

      <Camera 
        style={styles.camera} 
        ref={cameraRef}
        type={cameraType} // cameraType here is now valid
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </Camera>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#2d6a4f',
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 250,
    height: 250,
    marginVertical: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  tableContainer: {
    width: '100%',
    marginVertical: 20,
    backgroundColor: '#e3f9f5',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00796b',
    width: '60%',
  },
  tableData: {
    fontSize: 16,
    color: '#00796b',
    width: '40%',
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    width: '80%',
  },
  button: {
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#4caf50',
    paddingVertical :14,
    marginHorizontal :12,
    borderRadius :30,
    elevation :5
  },
  buttonText: {
    color:'#fff', 
    fontSize :18 ,
    fontWeight :'600'
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
    width: '100%',
  }
});

export default SoilAnalysis;
