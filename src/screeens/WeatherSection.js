import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WeatherSection = ({ onPress }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState(null);

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
    fetchSavedCoordinates();
  }, []);

  useEffect(() => {
    if (coordinates) {
      const fetchWeatherData = async () => {
        const apiKey = "05ea4cd6d47547b8aa1153123242512";
        const { latitude, longitude } = coordinates[0];
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&aqi=no`;

        try {
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

      fetchWeatherData();
    }
  }, [coordinates]);

  const handlePress = () => {
    setLoading(true);
    setWeatherData(null);
    setError(null);
    fetchSavedCoordinates();
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loaderText}>Fetching weather data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onPress || handlePress}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { location, current } = weatherData;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress || handlePress}>
      {/* Header Row */}
      <View style={styles.row}>
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png" }}
          style={styles.icon}
        />
        <Text style={styles.title}>Current Weather</Text>
      </View>

      {/* Location */}
      <Text style={styles.location}>
        {location.name}, {location.region}, {location.country}
      </Text>

      {/* Temperature */}
      <View style={styles.temperatureContainer}>
        <Image source={{ uri: `https:${current.condition.icon}` }} style={styles.weatherIcon} />
        <Text style={styles.temperature}>{current.temp_c}°C</Text>
      </View>
      <Text style={styles.description}>{current.condition.text}</Text>

      {/* Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>Cloud Cover: {current.cloud}%</Text>
        <Text style={styles.detail}>Humidity: {current.humidity}%</Text>
        <Text style={styles.detail}>Wind: {current.wind_kph} kph ({current.wind_dir})</Text>
        <Text style={styles.detail}>Pressure: {current.pressure_mb} hPa</Text>
        <Text style={styles.detail}>Feels Like: {current.feelslike_c}°C</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    width: 36,
    height: 36,
    marginRight: 10,
    tintColor: "#2e7d32", // green tint
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
  },
  location: {
    fontSize: 15,
    color: "#555",
    marginBottom: 10,
  },
  temperatureContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  weatherIcon: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  temperature: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
  },
  description: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#444",
    marginBottom: 12,
  },
  detailsContainer: {
    backgroundColor: "#f9fbe7",
    padding: 12,
    borderRadius: 8,
  },
  detail: {
    fontSize: 14,
    color: "#555",
    marginVertical: 2,
  },
  loaderContainer: {
    padding: 16,
    alignItems: "center",
  },
  loaderText: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },
  errorContainer: {
    padding: 16,
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#DC3545",
    textAlign: "center",
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default WeatherSection;
