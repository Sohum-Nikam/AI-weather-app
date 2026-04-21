import React from 'react';
import type { WeatherData } from '../../types/weather';
import { celsiusToFahrenheit, formatTime } from '../../utils/weather';
import { useUnit } from '../../contexts/UnitContext';
import './HourlyForecast.css';

interface HourlyForecastProps {
  data: WeatherData;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ data }) => {
  const { unit } = useUnit();
  
  const times = data.weather.hourly.time;
  const now = new Date();
  const startIndex = times.findIndex(t => new Date(t).getTime() >= now.getTime());
  const hoursData = startIndex !== -1 ? startIndex : 0;
  
  // Get 24 hour slice
  const next24Temps = data.weather.hourly.temperature_2m.slice(hoursData, hoursData + 24);
  const next24Times = times.slice(hoursData, hoursData + 24);

  // Calculate min and max for the bar scaling
  const minTemp = Math.min(...next24Temps);
  const maxTemp = Math.max(...next24Temps);
  const range = maxTemp - minTemp || 1; // avoid division by zero

  return (
    <div className="hourly-forecast">
      <h3 className="hourly-title">24-Hour Forecast</h3>
      <div className="hourly-chart-container">
        {next24Temps.map((tempC, idx) => {
          const displayTemp = unit === 'celsius' ? Math.round(tempC) : Math.round(celsiusToFahrenheit(tempC));
          const time = next24Times[idx];
          
          // Calculate height % (min 20%, max 100%)
          const heightPercent = 20 + ((tempC - minTemp) / range) * 80;

          return (
            <div key={time} className="hourly-column">
              <span className="hourly-temp-label">{displayTemp}°</span>
              <div className="bar-wrapper">
                <div 
                  className="temp-bar" 
                  style={{ height: `${heightPercent}%` }}
                />
              </div>
              <span className="hourly-time">{idx === 0 ? 'Now' : formatTime(time).replace(':00', '')}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
