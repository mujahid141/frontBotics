import React, { useContext, useState, useEffect } from "react";
import { StyleSheet, View, Text, Alert, Button } from "react-native";
import MapView, { Polygon, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { AuthContext } from "../context/AuthContext";

const FarmIdentification = () => {
  const { user } = useContext(AuthContext);
  const [userLocation, setUserLocation] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [boundingBox, setBoundingBox] = useState([]);
  const [mapRegion, setMapRegion] = useState(null); // Keeps the map region static

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
  }, []);

  // Handle map press to set the starting point
  const handleMapPress = (event) => {
    if (!dragging) {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setStartPoint({ latitude, longitude });
      setBoundingBox([]);
    }
  };

  // Handle drag event to update the bounding box dynamically
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

  // Finalize selection on touch release
  const handleDragEnd = () => {
    if (boundingBox.length > 0) {
      setDragging(false);
      Alert.alert("Selection Complete", "You have selected an area!");
    }
  };

  // Reset the selection
  const resetSelection = () => {
    setStartPoint(null);
    setBoundingBox([]);
    setDragging(false);
  };

  // Prevent map gestures during selection
  const handleRegionChange = (region) => {
    if (!dragging) {
      setMapRegion(region); // Update region only when not selecting
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
            region={mapRegion} // Keep map static during selection
            onRegionChangeComplete={handleRegionChange}
            showsUserLocation={true}
            onPress={handleMapPress} // Start selection
            onPanDrag={handlePanDrag} // Drag to update selection
            onTouchEnd={handleDragEnd} // Finalize selection
            scrollEnabled={!dragging} // Disable scroll during selection
            zoomEnabled={!dragging} // Disable zoom during selection
          >
            {/* Display dynamic bounding box */}
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
            {boundingBox.length > 0 && <Button title="Confirm Selection" onPress={() => Alert.alert("Area Selected!")} />}
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
