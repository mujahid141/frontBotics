import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';

const BotInteractionWidget = ({ chatBotData, loading }) => {
  const interactions = chatBotData?.Bot_Interaction || [];

  const renderItem = ({ item, index }) => (
    <View style={styles.interactionCard} key={index}>
      <Text style={styles.label}>User Question:</Text>
      <Text style={styles.question}>“{item.question}”</Text>

      {item.matched_question && (
        <>
          <Text style={styles.label}>Matched Question:</Text>
          <Text style={styles.matched}>{item.matched_question}</Text>
        </>
      )}

      <Text style={styles.label}>Answer:</Text>
      <Text style={styles.answer}>{item.answer}</Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/4712/4712100.png',
          }}
          style={styles.icon}
        />
        <Text style={styles.title}>Bot Interaction</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#1e88e5" />
      ) : interactions.length === 0 ? (
        <Text style={styles.empty}>No interaction data available.</Text>
      ) : (
        <FlatList
          data={interactions}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
        />
      )}
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
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e88e5',
  },
  interactionCard: {
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  question: {
    fontSize: 14,
    color: '#222',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  matched: {
    fontSize: 14,
    color: '#1e88e5',
    marginBottom: 4,
  },
  answer: {
    fontSize: 14,
    color: '#000',
  },
  empty: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BotInteractionWidget;
