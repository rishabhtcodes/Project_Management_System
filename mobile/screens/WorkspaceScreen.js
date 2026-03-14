import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import boardService from '../api/board';

const WorkspaceScreen = ({ route, navigation }) => {
  const { workspaceId, workspaceName } = route.params;
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: workspaceName });
    loadBoards();
  }, []);

  const loadBoards = async () => {
    try {
      const res = await boardService.getBoards(workspaceId);
      setBoards(res.data);
    } catch (error) {
      console.log('Failed to fetch boards', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.boardCard, { backgroundColor: item.background || '#0079bf' }]}
      onPress={() => navigation.navigate('Board', { boardId: item._id, boardTitle: item.title })}
    >
      <Text style={styles.boardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Boards</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0079bf" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={boards}
          numColumns={2}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No boards found.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', padding: 20, color: '#334155' },
  list: { paddingHorizontal: 15 },
  row: { justifyContent: 'space-between', marginBottom: 15 },
  boardCard: { flex: 1, aspectRatio: 1.5, marginHorizontal: 5, borderRadius: 8, padding: 15, justifyContent: 'space-between' },
  boardTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#64748b', marginTop: 20, flex: 1 }
});

export default WorkspaceScreen;
