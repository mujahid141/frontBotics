import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const DetailsWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    try {
      const storedCoordinates = await AsyncStorage.getItem("selectedCoordinates");
      const coordinates = storedCoordinates ? JSON.parse(storedCoordinates) : null;

      if (!coordinates || coordinates.length === 0) {
        throw new Error("Coordinates not found. Please select an area first.");
      }

      const centerLat = (coordinates[0].latitude + coordinates[2].latitude) / 2;
      const centerLon = (coordinates[0].longitude + coordinates[2].longitude) / 2;

      const apiKey = "05ea4cd6d47547b8aa1153123242512";
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${centerLat},${centerLon}&aqi=no`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error fetching weather data: ${response.status}`);

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loaderText}>Gathering weather insights for your farm...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#DC3545" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchWeatherData}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { location, current } = weatherData;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#81C784", "#4CAF50"]} style={styles.headerContainer}>
        <Text style={styles.header}>Farm Weather Report</Text>
        <Text style={styles.location}>
          {location.name}, {location.region}, {location.country}
        </Text>
      </LinearGradient>

      {/* Overview */}
      <View style={styles.overviewCard}>
        <Image source={{ uri: `https:${current.condition.icon}` }} style={styles.weatherIcon} />
        <Text style={styles.temperature}>{current.temp_c}°C</Text>
        <Text style={styles.condition}>{current.condition.text}</Text>

        <View
          style={[
            styles.statusBadge,
            current.condition.text.toLowerCase() === "clear"
              ? styles.statusClear
              : styles.statusObservation
          ]}
        >
          <Text style={styles.statusText}>
            {current.condition.text.toLowerCase() === "clear"
              ? "Stress Free"
              : "Under Observation"}
          </Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailsHeader}>Detailed Weather</Text>
        {renderDetail("Cloud Cover", `${current.cloud}%`, "wb-cloudy")}
        {renderDetail("Humidity", `${current.humidity}%`, "opacity")}
        {renderDetail("Wind Speed", `${current.wind_kph} kph (${current.wind_dir})`, "air")}
        {renderDetail("Precipitation", `${current.precip_mm} mm`, "grain")}
        {renderDetail("Pressure", `${current.pressure_mb} hPa`, "speed")}
        {renderDetail("UV Index", current.uv, "light-mode")}
        {renderDetail("Visibility", `${current.vis_km} km`, "visibility")}
        {renderDetail("Feels Like", `${current.feelslike_c}°C`, "thermostat")}
      </View>
    </ScrollView>
  );
};

// Helper to render detail rows
const renderDetail = (label, value, icon) => (
  <View style={styles.detailRow} key={label}>
    <View style={styles.detailLeft}>
      <MaterialIcons name={icon} size={22} color="#4CAF50" />
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f9fc" },
  headerContainer: {
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    alignItems: "center",
  },
  header: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  location: { fontSize: 15, color: "#E8F5E9", marginTop: 5 },
  overviewCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  weatherIcon: { width: 90, height: 90 },
  temperature: { fontSize: 38, fontWeight: "bold", color: "#2E7D32", marginVertical: 5 },
  condition: { fontSize: 18, fontStyle: "italic", color: "#555" },
  statusBadge: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusClear: { backgroundColor: "#C8E6C9" },
  statusObservation: { backgroundColor: "#FFCDD2" },
  statusText: { fontSize: 14, fontWeight: "bold", color: "#333" },
  detailsCard: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
  },
  detailsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    alignItems: "center",
  },
  detailLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailLabel: { fontSize: 15, color: "#555", marginLeft: 6 },
  detailValue: { fontSize: 15, fontWeight: "600", color: "#000" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loaderText: { fontSize: 16, color: "#555", marginTop: 8 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { fontSize: 16, color: "#DC3545", textAlign: "center", marginTop: 8 },
  retryBtn: {
    marginTop: 15,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default DetailsWeather;
