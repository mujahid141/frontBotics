import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DetailsWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const storedCoordinates = await AsyncStorage.getItem("selectedCoordinates");
        const coordinates = storedCoordinates ? JSON.parse(storedCoordinates) : null;

        if (!coordinates || coordinates.length === 0) {
          throw new Error("Coordinates not found. Please select an area first.");
        }

        const centerLat = (coordinates[0].latitude + coordinates[2].latitude) / 2;
        const centerLon = (coordinates[0].longitude + coordinates[2].longitude) / 2;

        const apiKey = "05ea4cd6d47547b8aa1153123242512"; // Replace with your WeatherAPI key
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${centerLat},${centerLon}&aqi=no`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error fetching weather data: ${response.status}`);
        }
        const data = await response.json();
        setWeatherData(data);
        console.log(data)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

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
      </View>
    );
  }

  const { location, current } = weatherData;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Farm Weather Report</Text>
        <Text style={styles.location}>
          Location: {location.name}, {location.region}, {location.country}
        </Text>
      </View>

      <View style={styles.overviewContainer}>
        <Image source={{ uri: `https:${current.condition.icon}` }} style={styles.icon} />
        <Text style={styles.temperature}>{current.temp_c}°C</Text>
        <Text style={styles.condition}>{current.condition.text}</Text>
        <Text style={styles.subHeader}>
          Your farm is{" "}
          <Text
            style={
              current.condition.text.toLowerCase() === "clear"
                ? styles.statusClear
                : styles.statusObservation
            }
          >
            {current.condition.text.toLowerCase() === "clear" ? "Stress Free" : "Under Observation"}
          </Text>
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailsHeader}>Detailed Weather Information:</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Cloud Cover:</Text>
          <Text style={styles.detailValue}>{current.cloud}%</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Humidity:</Text>
          <Text style={styles.detailValue}>{current.humidity}%</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Wind Speed:</Text>
          <Text style={styles.detailValue}>{current.wind_kph} kph ({current.wind_dir})</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Precipitation:</Text>
          <Text style={styles.detailValue}>{current.precip_mm} mm</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Pressure:</Text>
          <Text style={styles.detailValue}>{current.pressure_mb} hPa</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>UV Index:</Text>
          <Text style={styles.detailValue}>{current.uv}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Visibility:</Text>
          <Text style={styles.detailValue}>{current.vis_km} km</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Soil Feels Like:</Text>
          <Text style={styles.detailValue}>{current.feelslike_c}°C</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  headerContainer: {
    backgroundColor: "#4CAF50",
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
  },
  location: {
    fontSize: 16,
    color: "#E8F5E9",
    marginTop: 5,
  },
  overviewContainer: {
    alignItems: "center",
    padding: 20,
  },
  icon: {
    width: 80,
    height: 80,
  },
  temperature: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
    marginVertical: 10,
  },
  condition: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#555",
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  statusClear: {
    color: "#28A745",
    fontWeight: "bold",
  },
  statusObservation: {
    color: "#DC3545",
    fontWeight: "bold",
  },
  detailsContainer: {
    backgroundColor: "#FFF",
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  detailLabel: {
    fontSize: 16,
    color: "#555",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loaderText: {
    fontSize: 16,
    color: "#555",
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  errorText: {
    fontSize: 16,
    color: "#DC3545",
    textAlign: "center",
  },
});

export default DetailsWeather;
