// utils/shareutils.js
import AsyncStorage from '@react-native-async-storage/async-storage';

let BASE_URL = ''; // Will be set at runtime

export const setBaseUrl = (ip) => {
  BASE_URL = `${ip}/api/`;
};

export const getBaseUrl = () => BASE_URL;

export const initBaseUrl = async () => {
  const ip = await AsyncStorage.getItem('user_ip');
  if (ip) {
    setBaseUrl(ip);
  }
};
