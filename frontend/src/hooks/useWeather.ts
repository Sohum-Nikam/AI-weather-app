import { useState, useCallback } from 'react';
import type { WeatherData } from '../types/weather';
import { fetchWeather } from '../services/api';

export const useWeather = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchCity = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchWeather(city);
      setData(result);
    } catch (err: any) {
      setData(null);
      setError(err.response?.data?.error || 'Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, searchCity };
};
