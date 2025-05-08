import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, View, Text, Alert, Button } from "react-native";
import MapView, { Polygon, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

const FarmIdentification = () => {
  const { user } = useContext(AuthContext);
  const [userLocation, setUserLocation] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [boundingBox, setBoundingBox] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);

  

  useEffect(() => {
    const getLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required to use this feature.");
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
      setMapRegion(initialRegion); // Initialize map region
    };

    getLocationPermission();
    loadCoordinates();
  }, []);

  const loadCoordinates = async () => {
    try {
      const storedCoordinates = await AsyncStorage.getItem("selectedCoordinates");
      if (storedCoordinates) {
        const parsedCoordinates = JSON.parse(storedCoordinates);
        setBoundingBox(parsedCoordinates);
      }
    } catch (error) {
      console.error("Error loading coordinates:", error);
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
      Alert.alert("Selection Complete", "You have selected an area!");
    }
  };

  const resetSelection = () => {
    setStartPoint(null);
    setBoundingBox([]);
    setDragging(false);
  };

  const handleRegionChange = (region) => {
    if (!dragging) {
      setMapRegion(region);
    }
  };

  const saveCoordinates = async () => {
    try {
      await AsyncStorage.setItem("selectedCoordinates", JSON.stringify(boundingBox));
      Alert.alert("Area Confirmed", "Your selected area has been saved.");
    } catch (error) {
      console.error("Error saving coordinates:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Farm Selection</Text>
      {user && <Text style={styles.welcome}>Welcome, {user.username}!</Text>}

      {userLocation ? (
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
            <Marker coordinate={userLocation} title="You are here!" />
          </MapView>
          <View style={styles.controls}>
            <Button title="Reset Selection" onPress={resetSelection} color="#FF6347" />
            {boundingBox.length > 0 && <Button title="Confirm Selection" onPress={saveCoordinates} />}
          </View>
        </>
      ) : (
        <Text style={styles.loading}>Fetching your location...</Text>
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
    marginVertical: 5,
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
  },
});

export default FarmIdentification;
