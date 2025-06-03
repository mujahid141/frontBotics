import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const PestDetectionWidget = () => {
    const pestData = [
        { name: 'Aphids', population: 35, color: '#e53935', legendFontColor: '#000', legendFontSize: 12 },
        { name: 'Whiteflies', population: 25, color: '#fb8c00', legendFontColor: '#000', legendFontSize: 12 },
        { name: 'Armyworm', population: 15, color: '#43a047', legendFontColor: '#000', legendFontSize: 12 },
        { name: 'Others', population: 25, color: '#1e88e5', legendFontColor: '#000', legendFontSize: 12 }
    ];

    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1998/1998610.png' }}
                    style={styles.icon}
                />
                <Text style={styles.title}>Pest Detection</Text>
            </View>

            <Text style={styles.label}>Pest Risk Level: <Text style={[styles.value, { color: '#e53935' }]}>High</Text></Text>
            <Text style={styles.label}>Detected Pests:</Text>
            <Text style={styles.value}>• Aphids</Text>
            <Text style={styles.value}>• Whiteflies</Text>
            <Text style={styles.value}>• Armyworm</Text>

            <Text style={styles.subheading}>Pest Distribution</Text>
            <PieChart
                data={pestData}
                width={screenWidth - 40}
                height={200}
                chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff3e0',
                    backgroundGradientTo: '#ffe0b2',
                    color: (opacity = 1) => `rgba(255, 87, 34, ${opacity})`,
                    labelColor: () => '#000',
                }}
                accessor={'population'}
                backgroundColor={'transparent'}
                paddingLeft={'15'}
                absolute
                style={{ marginTop: 10 }}
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
});

export default PestDetectionWidget;
