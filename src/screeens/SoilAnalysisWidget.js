import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const SoilAnalysisWidget = ({ data }) => {
  if (!data) return null;

  const { avg_ph, avg_phosphorus, avg_organic_matter, avg_electrical_conductivity } = data;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.row}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2900/2900661.png' }}
          style={styles.icon}
        />
        <Text style={styles.title}>Soil Analysis</Text>
      </View>

      {/* Details */}
      <Text style={styles.label}>
        pH Level: <Text style={styles.value}>{avg_ph}</Text>
      </Text>
      <Text style={styles.label}>
        Phosphorus: <Text style={styles.value}>{avg_phosphorus} mg/kg</Text>
      </Text>
      <Text style={styles.label}>
        Organic Matter: <Text style={styles.value}>{avg_organic_matter}%</Text>
      </Text>
      <Text style={styles.label}>
        EC: <Text style={styles.value}>{avg_electrical_conductivity} dS/m</Text>
      </Text>

      {/* Chart */}
      <Text style={styles.subheading}>Soil Nutrient Levels</Text>
      <BarChart
        data={{
          labels: ['pH', 'P', 'OM', 'EC'],
          datasets: [
            {
              data: [
                avg_ph,
                avg_phosphorus,
                avg_organic_matter,
                avg_electrical_conductivity,
              ],
            },
          ],
        }}
        width={screenWidth - 56} // match card padding
        height={200}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#f1f8e9',
          backgroundGradientTo: '#dcedc8',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          barPercentage: 0.5,
        }}
        style={styles.chartStyle}
        fromZero={true}
        withInnerLines={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 36,
    height: 36,
    marginRight: 10,
    tintColor: '#2e7d32', // green tint to match theme
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
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
  chartStyle: {
    marginTop: 12,
    borderRadius: 8,
    alignSelf: 'center',
  },
});

export default SoilAnalysisWidget;
