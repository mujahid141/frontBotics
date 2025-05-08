import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import WeatherSection from './WeatherSection';
const HomeScreen = ({ navigation }) => {


  return (
    <View style={styles.container}>
      {/* Header with Icons */}
      <View style={styles.header}>
        <Text style={styles.farmName}>Farm's Name</Text>
        <View style={styles.iconContainer}>
          <Icon name="user" size={24} color="gray" style={styles.icon} onPress={() => navigation.navigate('Profile')} />
          <Icon name="bell" size={24} color="green" style={styles.icon} onPress={() => navigation.navigate('Notifications')} />
          <Icon name="cog" size={24} color="green" style={styles.icon} onPress={() => navigation.navigate('Settings')} />
        </View>
      </View>

      {/* Weather Section */}
      <WeatherSection />

      {/* Buttons for Soil and Pest Analysis */}
      <View style={styles.analysisContainer}>
        <TouchableOpacity style={styles.analysisButton} onPress={() => navigation.navigate('SoilAnalysis')}>
          <Text style={styles.analysisButtonText}>Soil Health Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.analysisButton} onPress={() => navigation.navigate('FarmIdentification')}>
          <Text style={styles.analysisButtonText}>Identify Suitable Farms</Text>
        </TouchableOpacity>

        {/* Placeholder buttons for additional features */}
        <TouchableOpacity style={styles.analysisButton} onPress={() => navigation.navigate('PestAnalysis')}> 
          <Text style={styles.analysisButtonText}>Pest Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.analysisButton} onPress={() => navigation.navigate('CummuntyChat')}>
          <Text style={styles.analysisButtonText}>Cummunity</Text>
        </TouchableOpacity>
      </View>
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
  weatherContainer: {
    backgroundColor: '#e6f5f3',
    borderRadius: 10,
    padding: 16,
    marginVertical: 16,
  },
  weatherHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherSubHeader: {
    color: '#6b8e23',
    fontSize: 14,
    marginTop: 4,
  },
  weatherLocation: {
    color: '#6b8e23',
    fontSize: 14,
    marginBottom: 12,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherIcon: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  temperatureText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  weatherDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  weatherDetails: {
    fontSize: 14,
    color: '#777',
    marginBottom: 12,
  },
  weatherStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weatherStat: {
    fontSize: 14,
    color: '#555',
  },
  analysisContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  analysisButton: {
    width: '45%',
    height: 100,
    backgroundColor: '#a2dec8',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  analysisButtonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default HomeScreen;
