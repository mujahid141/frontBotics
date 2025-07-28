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
      if (__DEV__) console.error("Location error:", err);
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
      if (__DEV__) console.error("Error loading coordinates:", err);
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
    if (boundingBox.length === 4) {
      setDragging(false);
      Alert.alert("Area Selected", "You've selected your farm area.");
    }
  };

  const resetSelection = () => {
    setStartPoint(null);
    setBoundingBox([]);
    setDragging(false);
  };

  const saveCoordinates = async () => {
    try {
      if (boundingBox.length === 4) {
        await AsyncStorage.setItem("selectedCoordinates", JSON.stringify(boundingBox));
        Alert.alert("Saved", "Coordinates stored locally.");
      } else {
        Alert.alert("Invalid Area", "Please select a rectangular area.");
      }
    } catch (err) {
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
      if (!baseUrl) throw new Error("Base URL is missing.");

      const areaSqMeters = getAreaOfPolygon(boundingBox);
      const areaHectares = (areaSqMeters / 10000).toFixed(2);

      const report = {
        coordinates: boundingBox,
        estimated_area: `${areaHectares} ha`,
        selected_at: new Date().toISOString(),
        latitude: Number(mapRegion.latitude.toFixed(6)),
        longitude: Number(mapRegion.longitude.toFixed(6)),
      };

      Alert.alert("Submitting", `Sending area: ${areaHectares} hectares...`);

      const res = await axios.post(
        `${baseUrl.replace(/\/+$/, "")}/farm/farm-reports/`,
        report,
        {
          headers: { Authorization: `Token ${userToken}` },
        }
      );

      Alert.alert("Success", "Farm report submitted.");
      if (__DEV__) console.log("Response:", res.data);
    } catch (err) {
      if (__DEV__) console.error("Submit error:", err);
      Alert.alert("Error", "Could not submit farm data.");
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
                strokeColor="#FF0000"
                fillColor="rgba(255, 0, 0, 0.2)"
                strokeWidth={2}
              />
            )}
            <Marker coordinate={userLocation} title="You are here" />
          </MapView>

          <View style={styles.controls}>
            <Button title="Reset" onPress={resetSelection} color="#FF6347" />
            {boundingBox.length === 4 && (
              <>
                <Button title="Save Area" onPress={saveCoordinates} />
                <Button title="Generate Farm Report" onPress={generateFarmReport} color="#4682B4" />
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
