import apiClient from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const register = async (name, email, password) => {
  const response = await apiClient.post('/auth/register', { name, email, password });
  if (response.data.token) {
    await AsyncStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  if (response.data.token) {
    await AsyncStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const getMe = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

const logout = async () => {
  await AsyncStorage.removeItem('token');
};

const authService = {
  register,
  login,
  getMe,
  logout
};

export default authService;
