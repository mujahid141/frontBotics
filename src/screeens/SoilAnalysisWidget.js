import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const SoilAnalysisWidget = ({ data }) => {
    if (!data) return null;

    const { avg_ph, avg_phosphorus, avg_organic_matter, avg_electrical_conductivity } = data;

    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2900/2900661.png' }}
                    style={styles.icon}
                />
                <Text style={styles.title}>Soil Analysis</Text>
            </View>

            <Text style={styles.label}>pH Level: <Text style={styles.value}>{avg_ph}</Text></Text>
            <Text style={styles.label}>Phosphorus: <Text style={styles.value}>{avg_phosphorus} mg/kg</Text></Text>
            <Text style={styles.label}>Organic Matter: <Text style={styles.value}>{avg_organic_matter}%</Text></Text>
            <Text style={styles.label}>EC: <Text style={styles.value}>{avg_electrical_conductivity} dS/m</Text></Text>

            <Text style={styles.subheading}>Soil Nutrient Levels</Text>
            <BarChart
                data={{
                    labels: ['pH', 'P', 'OM', 'EC'],
                    datasets: [{ data: [avg_ph, avg_phosphorus, avg_organic_matter, avg_electrical_conductivity] }],
                }}
                width={screenWidth - 40}
                height={200}
                chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#f1f8e9',
                    backgroundGradientTo: '#aed581',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(124, 179, 66, ${opacity})`,
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
        color: '#7CB342',
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
        marginLeft: -16, // shift chart slightly to the left
    },
});

export default SoilAnalysisWidget;
