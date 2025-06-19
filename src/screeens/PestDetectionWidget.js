import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const PestDetectionWidget = ({ pestRawData }) => {
    const colors = ['#e53935', '#fb8c00', '#43a047', '#1e88e5', '#8e24aa'];

    const pestData = Object.entries(pestRawData.pest_data || {}).map(([name, population], index) => ({
        name,
        population: Number(population) || 0,
        color: colors[index % colors.length],
    }));

    const totalPopulation = pestData.reduce((sum, item) => sum + item.population, 0);

    const getRiskLevel = () => {
        if (totalPopulation >= 5) return 'High';
        if (totalPopulation >= 3) return 'Moderate';
        return 'Low';
    };

    const riskLevel = getRiskLevel();
    const riskColor = riskLevel === 'High' ? '#e53935' : riskLevel === 'Moderate' ? '#fb8c00' : '#43a047';

    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1998/1998610.png' }}
                    style={styles.icon}
                />
                <Text style={styles.title}>Pest Detection</Text>
            </View>

            <Text style={styles.label}>
                Pest Risk Level: <Text style={[styles.value, { color: riskColor }]}>{riskLevel}</Text>
            </Text>

            <Text style={styles.label}>Detected Pests:</Text>
            {pestData.length > 0 ? (
                pestData.map((item, index) => (
                    <Text style={styles.value} key={index}>• {item.name}</Text>
                ))
            ) : (
                <Text style={styles.value}>No pest data available</Text>
            )}

            <Text style={styles.subheading}>Pest Distribution</Text>
            {totalPopulation > 0 ? (
                <>
                    <PieChart
                        data={pestData.map((item) => ({
                            name: item.name,
                            population: item.population,
                            color: item.color,
                            legendFontColor: '#000',
                            legendFontSize: 12,
                        }))}
                        width={screenWidth - 40}
                        height={200}
                        chartConfig={{
                            backgroundColor: '#fff',
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#fff',
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: () => '#000',
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        hasLegend={false}  // Disable internal legend
                        absolute
                        style={{ marginTop: 10 }}
                    />

                    <View style={styles.legendContainer}>
                        {pestData.map((item, index) => (
                            <View key={index} style={styles.legendItem}>
                                <View style={[styles.legendColorBox, { backgroundColor: item.color }]} />
                                <Text style={styles.legendText}>
                                    {item.name} ({item.population})
                                </Text>
                            </View>
                        ))}
                    </View>
                </>
            ) : (
                <Text style={styles.value}>Insufficient data for pie chart</Text>
            )}
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
        color: '#e53935',
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
        marginLeft: 6,
    },
    legendContainer: {
        marginTop: 12,
        paddingLeft: 4,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    legendColorBox: {
        width: 14,
        height: 14,
        marginRight: 8,
        borderRadius: 2,
    },
    legendText: {
        fontSize: 13,
        color: '#333',
    },
});

export default PestDetectionWidget;
