import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import cardService from '../api/card';

const CardDetailScreen = ({ route, navigation }) => {
  const { cardId, cardTitle } = route.params;
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: cardTitle });
    loadCardDetails();
  }, []);

  const loadCardDetails = async () => {
    try {
      const cRes = await cardService.getCard(cardId);
      setCard(cRes.data);
    } catch (error) {
      console.log('Failed to fetch card detail', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0079bf" />
      </View>
    );
  }

  if (!card) {
    return <Text style={styles.errorText}>Card not found</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{card.title}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        {card.description ? (
          <Text style={styles.descriptionText}>{card.description}</Text>
        ) : (
          <Text style={styles.placeholderText}>Add a more detailed description...</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity</Text>
        <Text style={styles.placeholderText}>Comments feature coming soon to mobile...</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#ef4444' },
  header: { backgroundColor: '#fff', padding: 20, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' },
  section: { padding: 20, backgroundColor: '#fff', marginTop: 15, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#e2e8f0' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#334155', marginBottom: 10 },
  descriptionText: { fontSize: 15, color: '#475569', lineHeight: 22 },
  placeholderText: { fontSize: 15, color: '#94a3b8', fontStyle: 'italic' }
});

export default CardDetailScreen;
