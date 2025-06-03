import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

import FarmWidget from './FarmWidget';
import WeatherWidget from './WeatherWidget';
import SoilAnalysisWidget from './SoilAnalysisWidget';
import PestDetectionWidget from './PestDetectionWidget';
import BotInteractionWidget from './BotInteractionWidget';
const Report = () => {
    const { user, userToken } = useContext(AuthContext);

    const handleSubscribe = () => {
        Alert.alert('Coming Soon', 'Subscribe feature will be available soon!');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Farm Report</Text>

            <FarmWidget /> {/* <- use here */}

            {/* <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
                <Text style={styles.buttonText}>Subscribe to Generate Full Report</Text>
            </TouchableOpacity> */}

            <WeatherWidget />

            <SoilAnalysisWidget />
            <PestDetectionWidget />
            <BotInteractionWidget />
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
