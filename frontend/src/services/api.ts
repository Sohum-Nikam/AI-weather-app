import axios from 'axios';
import type { WeatherData } from '../types/weather';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export const fetchWeather = async (city: string): Promise<WeatherData> => {
  const response = await axios.get(`${API_BASE_URL}/weather`, {
    params: { city }
  });
  return response.data;
};
