import React, { useState, useContext, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, RefreshControl, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import WeatherSection from './WeatherSection';
import { AuthContext } from "../context/AuthContext";
import { initBaseUrl } from '../utils/sharesUtils';

const HomeScreen = ({ navigation }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useContext(AuthContext);

  // ✅ Ensure base URL is initialized on first mount
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

  // ✅ Pull-to-refresh logic
  const onRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.farmName}>
          Welcome to {user?.farm_name || 'Your Farm'}
        </Text>

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

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <WeatherSection onPress={() => navigation.navigate('DetailWeather')} />

        <View style={styles.analysisContainer}>
          <AnalysisButton label="Soil Health Analysis" onPress={() => navigation.navigate('SoilAnalysis')} />
          <AnalysisButton label="Identify Farms" onPress={() => navigation.navigate('FarmIdentification')} />
          <AnalysisButton label="Pest Analysis" onPress={() => navigation.navigate('PestAnalysis')} />
          <AnalysisButton label="Community" onPress={() => navigation.navigate('CummunityChat')} />
          <AnalysisButton label="Ask Me!" onPress={() => navigation.navigate('Botanic')} />
          <AnalysisButton label="Analyze your farm" onPress={() => navigation.navigate('Report')} />
        </View>
      </ScrollView>
    </View>
  );
};

// ✅ Reusable component for buttons
const AnalysisButton = ({ label, onPress }) => (
  <TouchableOpacity style={styles.analysisButton} onPress={onPress}>
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
  },
  farmName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    flexWrap: 'wrap',
    paddingRight: 10,
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
    marginTop: 10,
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
    color: '#fff',
    textAlign: 'center',
  },
});

export default HomeScreen;
