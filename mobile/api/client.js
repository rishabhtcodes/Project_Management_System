import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Important: use your machine's IP address instead of localhost for Android/iOS simulators
const API_URL = 'http://10.0.2.2:5000/api/v1'; // 10.0.2.2 maps to localhost in Android Emulator

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
