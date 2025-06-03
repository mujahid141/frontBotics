import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const FarmWidget = () => {
    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/685/685352.png' }}
                    style={styles.icon}
                />
                <Text style={styles.title}>Farm Info</Text>
            </View>
            <Text style={styles.label}>Location: <Text style={styles.value}>Lahore, Pakistan</Text></Text>
            <Text style={styles.label}>Area: <Text style={styles.value}>5 Acres</Text></Text>
            <Text style={styles.label}>Coordinates:</Text>
            <Text style={styles.value}>Lat: 31.5204° N, Long: 74.3587° E</Text>
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
        color: '#388E3C',
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

export default FarmWidget;
