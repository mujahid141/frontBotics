import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const FarmWidget = ({ latitude, longitude, area, location }) => {
  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.row}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/685/685352.png' }}
          style={styles.icon}
        />
        <Text style={styles.title}>Farm Info</Text>
      </View>

      {/* Farm Details */}
      <Text style={styles.label}>
        Area: <Text style={styles.value}>{area || 'N/A'}</Text>
      </Text>

      {location && (
        <Text style={styles.label}>
          Location: <Text style={styles.value}>{location}</Text>
        </Text>
      )}

      <Text style={styles.label}>Coordinates:</Text>
      <Text style={styles.value}>
        Lat: {latitude || 'N/A'}, Long: {longitude || 'N/A'}
      </Text>
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
    tintColor: '#2e7d32', // Makes the icon match theme
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginTop: 6,
  },
  value: {
    fontWeight: '500',
    color: '#000',
  },
});

export default FarmWidget;
