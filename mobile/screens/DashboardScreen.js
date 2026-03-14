import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import workspaceService from '../api/workspace';
import { AuthContext } from '../context/AuthContext';

const DashboardScreen = ({ navigation }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout, user } = useContext(AuthContext);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const res = await workspaceService.getWorkspaces();
      setWorkspaces(res.data);
    } catch (error) {
      console.log('Failed to fetch workspaces', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.workspaceCard}
      onPress={() => navigation.navigate('Workspace', { workspaceId: item._id, workspaceName: item.name })}
    >
      <View style={styles.workspaceIcon}>
        <Text style={styles.workspaceIconText}>{item.name.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.workspaceName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Hello, {user?.name}</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Your Workspaces</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0079bf" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={workspaces}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No workspaces found.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  welcomeText: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  logoutBtn: { padding: 8, backgroundColor: '#f1f5f9', borderRadius: 6 },
  logoutText: { color: '#ef4444', fontWeight: '600' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', padding: 20, paddingTop: 30, color: '#334155' },
  list: { paddingHorizontal: 20 },
  workspaceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  workspaceIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  workspaceIconText: { color: '#0284c7', fontSize: 18, fontWeight: 'bold' },
  workspaceName: { fontSize: 16, fontWeight: '600', color: '#334155' },
  emptyText: { textAlign: 'center', color: '#64748b', marginTop: 20 }
});

export default DashboardScreen;
