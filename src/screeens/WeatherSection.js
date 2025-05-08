import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WeatherSection = ({ onPress }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

  // Move fetchSavedCoordinates out of the useEffect so it can be called manually
  const fetchSavedCoordinates = async () => {
    try {
      const storedCoordinates = await AsyncStorage.getItem("selectedCoordinates");
      if (storedCoordinates) {
        const parsedCoordinates = JSON.parse(storedCoordinates);
        setCoordinates(parsedCoordinates);
      } else {
        setError("No coordinates found. Please select an area first.");
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to fetch saved coordinates.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedCoordinates(); // Fetch coordinates initially on component mount
  }, []);

  useEffect(() => {
    if (coordinates) {
      const fetchWeatherData = async () => {
        const apiKey = "05ea4cd6d47547b8aa1153123242512"; // Replace with your WeatherAPI key
        const { latitude, longitude } = coordinates[0]; // Use the first point of the bounding box
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`;

        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Error fetching weather data: ${response.status}`);
          }
          const data = await response.json();
          setWeatherData(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchWeatherData();
    }
  }, [coordinates]);

  const handlePress = () => {
    // You can add any functionality you want on press here.
    setLoading(true); // Set loading to true to show the activity indicator again.
    setWeatherData(null); // Clear current weather data.
    setError(null); // Clear error message.
    fetchSavedCoordinates(); // Re-fetch saved coordinates and data
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loaderText}>Fetching weather data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handlePress}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { location, current } = weatherData;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress || handlePress}> {/* Ensure the passed onPress is used */}
      <Text style={styles.header}>Current Weather</Text>
      <Text style={styles.location}>
        {location.name}, {location.region}, {location.country}
      </Text>
      <View style={styles.temperatureContainer}>
        <Image source={{ uri: `https:${current.condition.icon}` }} style={styles.icon} />
        <Text style={styles.temperature}>{current.temp_c}°C</Text>
      </View>
      <Text style={styles.description}>{current.condition.text}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>Cloud Cover: {current.cloud}%</Text>
        <Text style={styles.detail}>Humidity: {current.humidity}%</Text>
        <Text style={styles.detail}>
          Wind: {current.wind_kph} kph ({current.wind_dir})
        </Text>
        <Text style={styles.detail}>Pressure: {current.pressure_mb} hPa</Text>
        <Text style={styles.detail}>Feels Like: {current.feelslike_c}°C</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: "#777",
    marginBottom: 16,
    textAlign: "center",
  },
  temperatureContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  temperature: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
  },
  description: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#444",
    marginBottom: 16,
  },
  detailsContainer: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
  },
  detail: {
    fontSize: 16,
    color: "#555",
    marginVertical: 4,
  },
  loaderText: {
    fontSize: 16,
    color: "#555",
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#DC3545",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
  },
});

export default WeatherSection;
