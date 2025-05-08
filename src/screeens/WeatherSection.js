import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, ActivityIndicator } from "react-native";

const WeatherSection = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const apiKey = "05ea4cd6d47547b8aa1153123242512"; // Replace with your WeatherAPI key
      const lat = 33.6156; // Replace with actual latitude
      const lon = 73.0640; // Replace with actual longitude
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;

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
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loaderText}>Loading weather data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const { location, current } = weatherData;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Current Weather</Text>
      <Text style={styles.subHeader}>
        Your farm is {current.condition.text.toLowerCase() === "clear" ? "Stress Free" : "Under Observation"}
      </Text>
      <Text style={styles.location}>{location.name}, {location.region}, {location.country}</Text>
      <View style={styles.temperatureContainer}>
        <Image source={{ uri: `https:${current.condition.icon}` }} style={styles.icon} />
        <Text style={styles.temperature}>{current.temp_c}°C</Text>
      </View>
      <Text style={styles.description}>{current.condition.text}</Text>
      <Text style={styles.details}>Cloud: {current.cloud}%</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.stat}>Humidity: {current.humidity}%</Text>
        <Text style={styles.stat}>Wind: {current.wind_kph} kph ({current.wind_dir})</Text>
        <Text style={styles.stat}>Pressure: {current.pressure_mb} hPa</Text>
        <Text style={styles.stat}>Feels Like: {current.feelslike_c}°C</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    marginVertical: 8,
    textAlign: "center",
  },
  location: {
    fontSize: 14,
    color: "gray",
    marginBottom: 12,
  },
  temperatureContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  temperature: {
    fontSize: 32,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    marginVertical: 8,
    textAlign: "center",
  },
  details: {
    fontSize: 14,
    color: "gray",
    marginBottom: 12,
  },
  statsContainer: {
    marginTop: 16,
  },
  stat: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },
  loaderText: {
    fontSize: 16,
    marginTop: 8,
    color: "#000",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default WeatherSection;
