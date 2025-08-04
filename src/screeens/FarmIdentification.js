import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView, { Polygon, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAreaOfPolygon } from "geolib";
import { getBaseUrl } from "../utils/sharesUtils";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

const FarmIdentification = () => {
  const { user, userToken } = useContext(AuthContext);
  const [userLocation, setUserLocation] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [boundingBox, setBoundingBox] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [areaHectares, setAreaHectares] = useState(null);

  useEffect(() => {
    (async () => {
      await requestLocation();
      await loadCoordinates();
    })();
  }, []);

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Location access is needed to mark your farm.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setUserLocation(region);
      setMapRegion(region);
    } catch (err) {
      Alert.alert("Location Error", "Failed to fetch location.");
      console.error(err);
    } finally {
      setLoadingLocation(false);
    }
  };

  const loadCoordinates = async () => {
    try {
      const stored = await AsyncStorage.getItem("selectedCoordinates");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setBoundingBox(parsed);
      }
    } catch (err) {
      console.error("Error loading coordinates:", err);
    }
  };

  const handleMapPress = (event) => {
    if (!dragging) {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setStartPoint({ latitude, longitude });
      setBoundingBox([]);
      setAreaHectares(null);
    }
  };

  const handlePanDrag = (event) => {
    if (startPoint) {
      setDragging(true);
      const { latitude, longitude } = event.nativeEvent.coordinate;
      const box = [
        startPoint,
        { latitude: startPoint.latitude, longitude },
        { latitude, longitude },
        { latitude, longitude: startPoint.longitude },
      ];
      setBoundingBox(box);

      const areaSqMeters = getAreaOfPolygon(box);
      setAreaHectares((areaSqMeters / 10000).toFixed(2));
    }
  };

  const handleDragEnd = () => {
    if (boundingBox.length === 4) {
      setDragging(false);
    }
  };

  const resetSelection = () => {
    setStartPoint(null);
    setBoundingBox([]);
    setAreaHectares(null);
    setDragging(false);
  };

  const saveCoordinates = async () => {
    if (boundingBox.length !== 4) {
      Alert.alert("Invalid Area", "Please select a rectangular area.");
      return;
    }
    try {
      await AsyncStorage.setItem("selectedCoordinates", JSON.stringify(boundingBox));
      Alert.alert("Saved", "Coordinates stored locally.");
    } catch {
      Alert.alert("Error", "Failed to save area.");
    }
  };

  const generateFarmReport = async () => {
    if (boundingBox.length !== 4 || !mapRegion) {
      Alert.alert("Error", "Please select a valid area first.");
      return;
    }

    try {
      const baseUrl = await getBaseUrl();
      const report = {
        coordinates: boundingBox,
        estimated_area: `${areaHectares} ha`,
        selected_at: new Date().toISOString(),
        latitude: Number(mapRegion.latitude.toFixed(6)),
        longitude: Number(mapRegion.longitude.toFixed(6)),
      };

      Alert.alert("Submitting", `Sending area: ${areaHectares} hectares...`);

      await axios.post(`${baseUrl}farm/farm-reports/`, report, {
        headers: { Authorization: `Token ${userToken}` },
      });

      Alert.alert("Success", "Farm report submitted.");
    } catch (err) {
      console.error("Submit error:", err);
      Alert.alert("Error", "Could not submit farm data.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farm Area Selection</Text>
      <Text style={styles.instructions}>
        Tap to set a starting point, then drag to create a rectangular farm area.
      </Text>

      {loadingLocation ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
      ) : userLocation ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={userLocation}
            region={mapRegion}
            onRegionChangeComplete={(region) => !dragging && setMapRegion(region)}
            showsUserLocation={true}
            onPress={handleMapPress}
            onPanDrag={handlePanDrag}
            onTouchEnd={handleDragEnd}
            scrollEnabled={!dragging}
            zoomEnabled={!dragging}
            mapType="satellite"
          >
            {boundingBox.length === 4 && (
              <Polygon
                coordinates={boundingBox}
                strokeColor="#4CAF50"
                fillColor="rgba(76, 175, 80, 0.3)"
                strokeWidth={2}
              />
            )}
            <Marker coordinate={userLocation} title="You are here" />
          </MapView>

          {areaHectares && (
            <View style={styles.areaInfo}>
              <Text style={styles.areaText}>Estimated Area: {areaHectares} ha</Text>
            </View>
          )}

          <View style={styles.controls}>
            <TouchableOpacity style={[styles.button, styles.resetBtn]} onPress={resetSelection}>
              <MaterialIcons name="refresh" size={20} color="#fff" />
              <Text style={styles.btnText}>Reset</Text>
            </TouchableOpacity>

            {boundingBox.length === 4 && (
              <>
                <TouchableOpacity style={styles.button} onPress={saveCoordinates}>
                  <MaterialIcons name="save" size={20} color="#fff" />
                  <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.submitBtn]} onPress={generateFarmReport}>
                  <MaterialIcons name="check" size={20} color="#fff" />
                  <Text style={styles.btnText}>Generate Report</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </>
      ) : (
        <Text style={styles.loading}>Unable to fetch your location.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f9fc" },
  title: {
    textAlign: "center",
    fontSize: 22,
    marginTop: 10,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  instructions: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 8,
    color: "#555",
    paddingHorizontal: 10,
  },
  map: { flex: 1 },
  areaInfo: {
    backgroundColor: "#fff",
    padding: 8,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  areaText: { fontSize: 16, fontWeight: "600", color: "#333" },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#f1f8e9",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  submitBtn: { backgroundColor: "#2e7d32" },
  resetBtn: { backgroundColor: "#e53935" },
  btnText: { color: "#fff", marginLeft: 5, fontWeight: "600" },
});

export default FarmIdentification;
