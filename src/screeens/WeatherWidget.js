import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { use } from 'react';

const screenWidth = Dimensions.get('window').width;

const WeatherWidget = () => {
    
    const [weatherData, setWeatherData] = React.useState(null);
    const fetchWeatherData = async () => {
  const apiKey = "05ea4cd6d47547b8aa1153123242512"; // 🔑 Replace with your real WeatherAPI key
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${farmData.latitude},${farmData.longitude}&days=5&aqi=no&alerts=no`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    
    
    setWeatherData(data.forecast.forecastday); 
    
    // NOTE: corrected typo from `forcast` to `forecast`
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
    fetchWeatherData();
}
, []);

    const forecast = weatherData ? weatherData.forecastday : [];

    const labels = forecast.map(day => {
        const date = new Date(day.date);
        return date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., Mon, Tue
    });

    const temps = forecast.map(day => day.day.avgtemp_c);

    const current = weatherData.current;

    return (
       (weatherData != null) ? (
       <View style={styles.card}>
            <View style={styles.row}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1116/1116453.png' }}
                    style={styles.icon}
                />
                <Text style={styles.title}>Weather Info</Text>
            </View>
            <Text style={styles.label}>Current Temp: <Text style={styles.value}>{current.temp_c}°C</Text></Text>
            <Text style={styles.label}>Humidity: <Text style={styles.value}>{current.humidity}%</Text></Text>
            <Text style={styles.label}>Rainfall Chance: <Text style={styles.value}>{forecast[0].day.daily_chance_of_rain}%</Text></Text>

            <Text style={styles.subheading}>Next 5 Days Forecast</Text>
            <LineChart
                data={{
                    labels: labels,
                    datasets: [{ data: temps }]
                }}
                width={screenWidth - 40}
                height={200}
                yAxisSuffix="°C"
                chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#e3f2fd',
                    backgroundGradientTo: '#90caf9',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                bezier
                style={{ marginTop: 10, borderRadius: 8 }}
            />
        </View>):(
        <View style={styles.card}>
            <Text style={styles.label}>Loading weather data...</Text>
        </View>
       )
    );
};


const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    icon: {
        width: 32,
        height: 32,
        marginRight: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1976D2',
    },
    subheading: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
        color: '#444',
    },
    label: {
        fontSize: 14,
        color: '#444',
        marginTop: 4,
    },
    value: {
        fontWeight: '500',
        color: '#000',
    },
});

export default WeatherWidget;
