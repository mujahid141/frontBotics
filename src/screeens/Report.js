import React, { useContext, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert ,  Image,} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/sharesUtils';
import FarmWidget from './FarmWidget';
import WeatherWidget from './WeatherWidget';
import SoilAnalysisWidget from './SoilAnalysisWidget';
import PestDetectionWidget from './PestDetectionWidget';
import BotInteractionWidget from './BotInteractionWidget';
import axios from 'axios';

const Report = ({ navigation }) => {
  const { user, userToken } = useContext(AuthContext);
  const [farmData, setFarmData] = useState(null);
  const [location, setLocation] = useState(null);
  const [soilData, setSoilData] = useState(null);
  const [pestData, setPestData] = useState(null);
const [chatBotData, setChatBotData] = useState(null);
  
  const [isSubscribed, setIsSubscribed] = useState(true); // Assuming user is subscribed by default
  
  if (paymentData && paymentData.length > 0) {
    const sortedPayments = paymentData.sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );
    const latestPayment = sortedPayments[0];
    console.log('Latest Payment:', latestPayment);
    if (latestPayment?.status?.toLowerCase() === 'completed') {
      setIsSubscribed(true);
    } else {
      setIsSubscribed(false);
    }
  }
  
  const [paymentData, setPaymentData] = useState(null);
  const handleSubscribe = () => {
    navigation.navigate('Payment');
    //setIsSubscribed(true);
  };
  const fetchPaymentData = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}payment/payment-get/`,
      {
        headers: {
          Authorization: `Token ${userToken}`,
        },
        timeout: 10000,
      }
    );

    if (response.status === 200 && Array.isArray(response.data)) {
      const payments = response.data;
      setPaymentData(payments);
      console.log('Payment Data:', payments);

      // Sort by updated_at descending to get the latest payment
      const sortedPayments = payments.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );

      const latestPayment = sortedPayments[0];

      if (latestPayment?.status?.toLowerCase() === 'completed') {
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }
    }
  } catch (error) {
    console.error('Error fetching payment data:', error);
  }
};

  const fetchFarmData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}farm/farm-reports/`, {
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
      const response = await axios.get(`${BASE_URL}report/soil-report`, {
        headers: { Authorization: `Token ${userToken}` },
      });
      setSoilData(response.data);
    } catch (error) {
      console.error('Error fetching soil data:', error);
    }
  };

  const fetchPestData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}report/leaf-disease-report/`, {
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
            const response = await axios.get(`${BASE_URL}report/chatbot-interaction/`, {
                headers: { Authorization: `Token ${userToken}` },
            });
            if (response.status === 200) {
                setChatBotData({
  Bot_Interaction: response.data["Bot_Interaction "] || []
});
                
                console.log('saved data',chatBotData)
            }
        } catch (error) {
            console.error('Error fetching chatbot data:', error);
            Alert.alert('Error', 'Failed to fetch chatbot data.');
        } finally {
            setLoading(false);
        }
    };

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([fetchFarmData(), fetchSoilData(), fetchPestData(),fetchChatBotData(),fetchPaymentData()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Farm Report</Text>

      {!isSubscribed ? (
        <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
          <Text style={styles.buttonText}>Subscribe to Generate Full Report</Text>
        </TouchableOpacity>
      ) :  (
         
        <>
          { farmData && <FarmWidget
            area={farmData.estimated_area}
            latitude={parseFloat(farmData.latitude)}
            longitude={parseFloat(farmData.longitude)}
            location={location}
          />}
          {/* { <WeatherWidget  /> } */}
          {soilData && <SoilAnalysisWidget data={soilData} />}
          {pestData && <PestDetectionWidget pestRawData={pestData} />}
         {chatBotData && (
  <View style={{
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    width: '100%',
  }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
      <Image
        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4712/4712100.png' }}
        style={{ width: 32, height: 32, marginRight: 8 }}
      />
      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1e88e5' }}>
        Bot Interaction
      </Text>
    </View>

    {Array.isArray(chatBotData?.Bot_Interaction) && chatBotData.Bot_Interaction.length > 0 ? (
      chatBotData.Bot_Interaction.map((item, index) => (
        <View
          key={index}
          style={{
            marginBottom: 14,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
            paddingBottom: 10,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#555' }}>
            User Question:
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#222',
              marginBottom: 4,
              fontStyle: 'italic',
            }}
          >
            “{item.question}”
          </Text>

          {item.matched_question && (
            <>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#555' }}>
                Matched Question:
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#1e88e5',
                  marginBottom: 4,
                }}
              >
                {item.matched_question}
              </Text>
            </>
          )}

          <Text style={{ fontSize: 13, fontWeight: '600', color: '#555' }}>
            Answer:
          </Text>
          <Text style={{ fontSize: 14, color: '#000' }}>{item.answer}</Text>
        </View>
      ))
    ) : (
      <Text style={{ fontSize: 14, color: '#999', textAlign: 'center', marginTop: 20 }}>
        No interaction data available.
      </Text>
    )}
  

  </View>
)}

        </>
      ) }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E7D32',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Report;
