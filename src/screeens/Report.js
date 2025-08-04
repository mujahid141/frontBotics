import React, { useContext, useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground,
  ActivityIndicator
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { getBaseUrl } from '../utils/sharesUtils';
import FarmWidget from './FarmWidget';
import WeatherWidget from './WeatherWidget';
import SoilAnalysisWidget from './SoilAnalysisWidget';
import PestDetectionWidget from './PestDetectionWidget';
import axios from 'axios';

const Report = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const [farmData, setFarmData] = useState(null);
  const [location, setLocation] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [pestData, setPestData] = useState(null);
  const [chatBotData, setChatBotData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [loading, setLoading] = useState(true);

  const handleSubscribe = () => {
    navigation.navigate('Payment');
  };

  const fetchPaymentData = async () => {
    try {
      const response = await axios.get(
        `${getBaseUrl()}payment/payment-get/`,
        { headers: { Authorization: `Token ${userToken}` }, timeout: 10000 }
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        const sortedPayments = response.data.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        setPaymentData(response.data);
        const latestPayment = sortedPayments[0];
        setIsSubscribed(latestPayment?.status?.toLowerCase() === 'completed');
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };

  const fetchFarmData = async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}farm/farm-reports/`, {
        headers: { Authorization: `Token ${userToken}` },
      });
      if (response.status === 200) {
        setFarmData(response.data);
        setLocation(
          `${response.data.city || 'Unknown City'}, ${response.data.region || 'Unknown Region'}`
        );
      }
    } catch (error) {
      console.error('Error fetching farm data:', error);
      Alert.alert('Error', 'Failed to fetch farm data.');
    }
  };

  const fetchSoilData = async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}report/soil-report`, {
        headers: { Authorization: `Token ${userToken}` },
      });
      setSoilData(response.data);
    } catch (error) {
      console.error('Error fetching soil data:', error);
    }
  };

  const fetchPestData = async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}report/leaf-disease-report/`, {
        headers: { Authorization: `Token ${userToken}` },
      });
      if (response.status === 200) {
        setPestData(response.data);
      }
    } catch (error) {
      console.error('Error fetching pest data:', error);
      Alert.alert('Error', 'Failed to fetch pest data.');
    }
  };

  const fetchChatBotData = async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}report/chatbot-interaction/`, {
        headers: { Authorization: `Token ${userToken}` },
      });
      if (response.status === 200) {
        setChatBotData({
          Bot_Interaction: response.data["Bot_Interaction "] || []
        });
      }
    } catch (error) {
      console.error('Error fetching chatbot data:', error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([
        fetchFarmData(),
        fetchSoilData(),
        fetchPestData(),
        fetchChatBotData(),
        fetchPaymentData()
      ]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/chat.jpeg')}
      style={{ flex: 1 }}
      imageStyle={{ opacity: 0.20}}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>📋 Farm Report</Text>

        {!isSubscribed ? (
          <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
            <Text style={styles.subscribeButtonText}>
              Subscribe to Generate Full Report
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            {farmData && (
              <View style={styles.card}>
                <FarmWidget
                  area={farmData.estimated_area}
                  latitude={parseFloat(farmData.latitude)}
                  longitude={parseFloat(farmData.longitude)}
                  location={location}
                />
              </View>
            )}

            {soilData && (
              <View style={styles.card}>
                <SoilAnalysisWidget data={soilData} />
              </View>
            )}

            {pestData && (
              <View style={styles.card}>
                <PestDetectionWidget pestRawData={pestData} />
              </View>
            )}

            {chatBotData && (
              <View style={styles.card}>
                <View style={styles.botHeader}>
                  <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4712/4712100.png' }}
                    style={styles.botIcon}
                  />
                  <Text style={styles.botTitle}>Bot Interaction</Text>
                </View>

                {Array.isArray(chatBotData?.Bot_Interaction) &&
                chatBotData.Bot_Interaction.length > 0 ? (
                  chatBotData.Bot_Interaction.map((item, index) => (
                    <View key={index} style={styles.botItem}>
                      <Text style={styles.botLabel}>User Question:</Text>
                      <Text style={styles.botText}>“{item.question}”</Text>

                      {item.matched_question && (
                        <>
                          <Text style={styles.botLabel}>Matched Question:</Text>
                          <Text style={styles.botHighlight}>{item.matched_question}</Text>
                        </>
                      )}

                      <Text style={styles.botLabel}>Answer:</Text>
                      <Text style={styles.botText}>{item.answer}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noData}>No interaction data available.</Text>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E7D32',
  },
  subscribeButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 2,
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    width: '100%',
  },
  botHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  botIcon: { width: 32, height: 32, marginRight: 8 },
  botTitle: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32' },
  botItem: {
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  botLabel: { fontSize: 13, fontWeight: '600', color: '#555' },
  botText: {
    fontSize: 14,
    color: '#222',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  botHighlight: { fontSize: 14, color: '#1e88e5', marginBottom: 4 },
  noData: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 20 },
});

export default Report;
