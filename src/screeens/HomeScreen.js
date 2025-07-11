import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import WeatherSection from './WeatherSection';
import { AuthContext } from "../context/AuthContext";
import { initBaseUrl } from '../utils/sharesUtils';
const HomeScreen = ({ navigation }) => {
  // State for pull-to-refresh
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useContext(AuthContext);
   // Initialize base URL
  // Function to simulate a refresh
  const onRefresh = () => {
    setIsRefreshing(true);
    // Simulate a network request delay
    setTimeout(() => {
      setIsRefreshing(false); // Stop refreshing after the simulated delay
    }, 2000); // 2 seconds refresh time (adjust as needed)
  };

  return (
    <View style={styles.container}>
      {/* Header with Icons */}
      <View style={styles.header}>
      {user && <Text style={styles.farmName}>Welcome, {user.username}</Text>}

        <View style={styles.iconContainer}>
          <Icon
            name="user"
            size={24}
            color="gray"
            style={styles.icon}
            onPress={() => navigation.navigate('Profile')}
          />
          <Icon
            name="bell"
            size={24}
            color="green"
            style={styles.icon}
            onPress={() => navigation.navigate('Notification')}
          />
          <Icon
            name="cog"
            size={24}
            color="green"
            style={styles.icon}
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
      </View>

      {/* Scrollable content with pull-to-refresh */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* Weather Section */}
        <WeatherSection onPress={() => navigation.navigate('DetailWeather')} />

        {/* Buttons for Soil and Pest Analysis */}
        <View style={styles.analysisContainer}>
          <TouchableOpacity
            style={styles.analysisButton}
            onPress={() => navigation.navigate('SoilAnalysis')}
          >
            <Text style={styles.analysisButtonText}>Soil Health Analysis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.analysisButton}
            onPress={() => navigation.navigate('FarmIdentification')}
          >
            <Text style={styles.analysisButtonText}>Identify Farms</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.analysisButton}
            onPress={() => navigation.navigate('PestAnalysis')}
          >
            <Text style={styles.analysisButtonText}>Pest Analysis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.analysisButton}
            onPress={() => navigation.navigate('CummunityChat')}
          >
            <Text style={styles.analysisButtonText}>Community</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.analysisButton}
            onPress={() => navigation.navigate('Botanic')}
          >
            <Text style={styles.analysisButtonText}>Ask Me ! </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.analysisButton}
            onPress={() => navigation.navigate('Report')}
          >
            <Text style={styles.analysisButtonText}>Analyze your farm  </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8f5',
    padding: 16,
    marginTop: 35,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  farmName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 8,
  },
  scrollView: {
    flex: 1,
  },
  analysisContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  analysisButton: {
    width: '45%',
    height: 100,
    backgroundColor: 'green',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  analysisButtonText: {
    fontSize: 16,
    color: '#ffff',
    textAlign: 'center',
  },
});

export default HomeScreen;
