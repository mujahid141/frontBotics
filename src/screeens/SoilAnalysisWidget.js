import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const SoilAnalysisWidget = () => {
    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2900/2900661.png' }}
                    style={styles.icon}
                />
                <Text style={styles.title}>Soil Analysis</Text>
            </View>

            <Text style={styles.label}>pH Level: <Text style={styles.value}>6.8</Text></Text>
            <Text style={styles.label}>Phosphorus: <Text style={styles.value}>40 mg/kg</Text></Text>
            <Text style={styles.label}>Organic Matter: <Text style={styles.value}>3.2%</Text></Text>
            <Text style={styles.label}>EC: <Text style={styles.value}>0.8 dS/m</Text></Text>

            <Text style={styles.subheading}>Soil Nutrient Levels</Text>
            <BarChart
                data={{
                    labels: ['pH', 'P', 'OM', 'EC'],
                    datasets: [{ data: [6.8, 40, 3.2, 0.8] }],
                }}
                width={screenWidth - 40}
                height={200}
                yAxisSuffix=""
                chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#f1f8e9',
                    backgroundGradientTo: '#aed581',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(124, 179, 66, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                style={{ marginTop: 12, borderRadius: 8 }}
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
});

export default SoilAnalysisWidget;
