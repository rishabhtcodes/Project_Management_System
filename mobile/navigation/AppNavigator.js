import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import WorkspaceScreen from '../screens/WorkspaceScreen';
import BoardScreen from '../screens/BoardScreen';
import CardDetailScreen from '../screens/CardDetailScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#0079bf' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'TaskSprint' }} />
      <Stack.Screen name="Workspace" component={WorkspaceScreen} />
      <Stack.Screen name="Board" component={BoardScreen} />
      <Stack.Screen name="CardDetail" component={CardDetailScreen} options={{ presentation: 'modal' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
