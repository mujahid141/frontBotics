import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import WeatherSection from './WeatherSection';
import { AuthContext } from "../context/AuthContext";
import { initBaseUrl } from '../utils/sharesUtils';

const HomeScreen = ({ navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const setup = async () => {
      try {
        await initBaseUrl();
      } catch (error) {
        console.error("Base URL initialization failed:", error);
        Alert.alert("Error", "Failed to initialize base URL.");
      }
    };
    setup();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.farmName}>
          Welcome to <Text style={styles.highlight}>{user?.farm_name || 'Your Farm'}</Text>
        </Text>

        <View style={styles.iconContainer}>
          <Icon
            name="user"
            size={22}
            color="#4CAF50"
            style={styles.icon}
            onPress={() => navigation.navigate('Profile')}
          />
          <Icon
            name="bell"
            size={22}
            color="#4CAF50"
            style={styles.icon}
            onPress={() => navigation.navigate('Notification')}
          />
          <Icon
            name="cog"
            size={22}
            color="#4CAF50"
            style={styles.icon}
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
      </View>

      {/* Scroll Content */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* Weather Widget */}
        <WeatherSection onPress={() => navigation.navigate('DetailWeather')} />

        {/* Analysis Buttons */}
        <View style={styles.analysisContainer}>
          <AnalysisButton
            label="Soil Health Analysis"
            icon={<FontAwesome5 name="leaf" size={20} color="#2e7d32" />}
            onPress={() => navigation.navigate('SoilAnalysis')}
          />
          <AnalysisButton
            label="Identify Farms"
            icon={<MaterialIcons name="map" size={22} color="#2e7d32" />}
            onPress={() => navigation.navigate('FarmIdentification')}
          />
          <AnalysisButton
            label="Pest Analysis"
            icon={<FontAwesome5 name="bug" size={20} color="#2e7d32" />}
            onPress={() => navigation.navigate('PestAnalysis')}
          />
          <AnalysisButton
            label="Community"
            icon={<FontAwesome5 name="users" size={20} color="#2e7d32" />}
            onPress={() => navigation.navigate('CummunityChat')}
          />
          <AnalysisButton
            label="Ask Me!"
            icon={<FontAwesome5 name="robot" size={20} color="#2e7d32" />}
            onPress={() => navigation.navigate('Botanic')}
          />
          <AnalysisButton
            label="Analyze your farm"
            icon={<MaterialIcons name="analytics" size={22} color="#2e7d32" />}
            onPress={() => navigation.navigate('Report')}
          />
        </View>
      </ScrollView>
    </View>
  );
};

// Reusable Button Component
const AnalysisButton = ({ label, icon, onPress }) => (
  <TouchableOpacity style={styles.analysisButton} onPress={onPress}>
    {icon}
    <Text style={styles.analysisButtonText}>{label}</Text>
  </TouchableOpacity>
);

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
    marginBottom: 12,
  },
  farmName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    flexWrap: 'wrap',
    paddingRight: 10,
    color: '#333',
  },
  highlight: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: 6,
  },
  scrollView: {
    flex: 1,
  },
  analysisContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  analysisButton: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    alignItems: 'center',
  },
  analysisButtonText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default HomeScreen;
