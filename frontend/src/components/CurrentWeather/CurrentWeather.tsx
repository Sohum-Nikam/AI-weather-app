import React from 'react';
import type { WeatherData } from '../../types/weather';
import { getWeatherInfo } from '../../utils/weather';
import './CurrentWeather.css';

interface CurrentWeatherProps {
  data: WeatherData;
  omitTemp?: boolean;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, omitTemp }) => {
  const { current } = data.weather;
  const isDay = current.is_day === 1;
  const { icon: WeatherIcon, description } = getWeatherInfo(current.weather_code, isDay);

  return (
    <div className="current-weather-minimal">
      <div className="location-info">
        <h2 className="location-name">{data.location.name}</h2>
        <p className="location-region">{data.location.region}, {data.location.country}</p>
      </div>
      
      <div className="condition-info">
        <WeatherIcon className="condition-icon" />
        <span className="condition-desc">{description}</span>
      </div>
    </div>
  );
};
