import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Button,
  ActivityIndicator,
} from "react-native";
import MapView, { Polygon, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAreaOfPolygon } from "geolib";
import { getBaseUrl } from "../utils/sharesUtils";
import axios from "axios";

const FarmIdentification = () => {
  const { user, userToken } = useContext(AuthContext);
  const [userLocation, setUserLocation] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [boundingBox, setBoundingBox] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    const getLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Location permission is required.");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const initialRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setUserLocation(initialRegion);
        setMapRegion(initialRegion);
      } catch (error) {
        console.error("Location error:", error.message);
        Alert.alert("Error", "Unable to fetch your location.");
      } finally {
        setLoadingLocation(false);
      }
    };

    getLocationPermission();
    loadCoordinates();
  }, []);

  const loadCoordinates = async () => {
    try {
      const stored = await AsyncStorage.getItem("selectedCoordinates");
      if (stored) {
        setBoundingBox(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load saved coordinates:", error.message);
    }
  };

  const handleMapPress = (event) => {
    if (!dragging) {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setStartPoint({ latitude, longitude });
      setBoundingBox([]);
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
    }
  };

  const handleDragEnd = () => {
    if (boundingBox.length > 0) {
      setDragging(false);
      Alert.alert("Area Selected", "You’ve selected a region.");
    }
  };

  const resetSelection = () => {
    setStartPoint(null);
    setBoundingBox([]);
    setDragging(false);
  };

  const handleRegionChange = (region) => {
    if (!dragging) setMapRegion(region);
  };

  const saveCoordinates = async () => {
    try {
      await AsyncStorage.setItem("selectedCoordinates", JSON.stringify(boundingBox));
      Alert.alert("Success", "Area saved locally.");
    } catch (error) {
      Alert.alert("Error", "Failed to save area.");
    }
  };

  const generateFarmReport = async () => {
    if (boundingBox.length === 0) {
      Alert.alert("No area selected", "Please select an area first.");
      return;
    }

    try {
      const baseUrl = await getBaseUrl();
      if (!baseUrl) throw new Error("Base URL is not available");

      const areaSqMeters = getAreaOfPolygon(boundingBox);
      const areaHectares = (areaSqMeters / 10000).toFixed(2);
      const selectedAtISO = new Date().toISOString();

      const report = {
        coordinates: boundingBox,
        estimated_area: `${areaHectares} ha`,
        selected_at: selectedAtISO,
        latitude: Number(mapRegion.latitude.toFixed(6)),
        longitude: Number(mapRegion.longitude.toFixed(6)),
      };

      Alert.alert("Submitting", `Saving area: ${areaHectares} hectares...`);

      const res = await axios.post(
        `${baseUrl.replace(/\/+$/, '')}/farm/farm-reports/`,
        report,
        {
          headers: {
            Authorization: `Token ${userToken}`,
          },
        }
      );

      Alert.alert("✅ Saved", "Your farm data has been stored.");
      console.log("Farm report response:", res.data);
    } catch (error) {
      console.error("Error saving report:", error.message || error);
      Alert.alert("❌ Error", "Failed to save your farm data. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farm Selection</Text>
      {user && <Text style={styles.welcome}>Welcome, {user.username}!</Text>}

      {loadingLocation ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
      ) : userLocation ? (
        <>
          <MapView
            style={styles.map}
            initialRegion={userLocation}
            region={mapRegion}
            onRegionChangeComplete={handleRegionChange}
            showsUserLocation={true}
            onPress={handleMapPress}
            onPanDrag={handlePanDrag}
            onTouchEnd={handleDragEnd}
            scrollEnabled={!dragging}
            zoomEnabled={!dragging}
            mapType="satellite"
          >
            {boundingBox.length > 0 && (
              <Polygon
                coordinates={boundingBox}
                strokeColor="#FF0000"
                fillColor="rgba(255, 0, 0, 0.2)"
                strokeWidth={2}
              />
            )}
            <Marker coordinate={userLocation} title="You are here" />
          </MapView>

          <View style={styles.controls}>
            <Button title="Reset" onPress={resetSelection} color="#FF6347" />
            {boundingBox.length > 0 && (
              <>
                <Button title="Save Area" onPress={saveCoordinates} />
                <Button title="Generate Farm Report" onPress={generateFarmReport} color="#4682B4" />
              </>
            )}
          </View>
        </>
      ) : (
        <Text style={styles.loading}>Unable to access location.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    marginVertical: 10,
    fontWeight: "bold",
  },
  welcome: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 5,
  },
  map: {
    flex: 1,
    marginTop: 10,
  },
  loading: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 20,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    flexWrap: "wrap",
    gap: 10,
  },
});

export default FarmIdentification;
