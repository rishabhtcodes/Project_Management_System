import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import listService from '../api/list';
import cardService from '../api/card';

const BoardScreen = ({ route, navigation }) => {
  const { boardId, boardTitle } = route.params;
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: boardTitle });
    loadBoardData();
  }, []);

  const loadBoardData = async () => {
    try {
      const lRes = await listService.getLists(boardId);
      const fetchedLists = lRes.data || [];
      setLists(fetchedLists);

      const cardsData = {};
      for (const list of fetchedLists) {
        const cRes = await cardService.getCards(list._id);
        cardsData[list._id] = cRes.data || [];
      }
      setCards(cardsData);
    } catch (error) {
      console.log('Failed to fetch board data', error);
    } finally {
      setLoading(false);
    }
  };

  const openCardDetails = (card) => {
    navigation.navigate('CardDetail', { cardId: card._id, cardTitle: card.title });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0079bf" style={{ marginTop: 20 }} />;
  }

  return (
    <ScrollView 
      horizontal 
      style={styles.container}
      contentContainerStyle={{ padding: 15 }}
      showsHorizontalScrollIndicator={false}
    >
      {lists.map(list => (
        <View key={list._id} style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>{list.title}</Text>
          </View>
          
          <ScrollView style={styles.cardsContainer} showsVerticalScrollIndicator={false}>
            {(cards[list._id] || []).map(card => (
              <TouchableOpacity 
                key={card._id} 
                style={styles.card}
                onPress={() => openCardDetails(card)}
              >
                <Text style={styles.cardTitle}>{card.title}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addCardBtn}>
              <Text style={styles.addCardText}>+ Add a card</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      ))}
      <TouchableOpacity style={styles.addListBtn}>
        <Text style={styles.addListText}>+ Add another list</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0079bf' }, // Fallback color
  listContainer: { width: 280, backgroundColor: '#f1f5f9', borderRadius: 8, marginRight: 15, maxHeight: '100%', paddingBottom: 10 },
  listHeader: { padding: 15, paddingBottom: 10 },
  listTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
  cardsContainer: { paddingHorizontal: 10 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 6, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  cardTitle: { fontSize: 15, color: '#334155' },
  addCardBtn: { padding: 10, marginTop: 5 },
  addCardText: { color: '#64748b', fontWeight: '500' },
  addListBtn: { width: 280, backgroundColor: 'rgba(255,255,255,0.2)', padding: 15, borderRadius: 8, height: 50, justifyContent: 'center' },
  addListText: { color: '#fff', fontWeight: '600' }
});

export default BoardScreen;
