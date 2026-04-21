import React from 'react';
import { CloudRain, Activity } from 'lucide-react';
import type { WeatherData } from '../../types/weather';
import { getAqiCategory } from '../../utils/weather';
import './DetailsGrid.css';

interface DetailsGridProps {
  data: WeatherData;
}

export const DetailsGrid: React.FC<DetailsGridProps> = ({ data }) => {
  const { current } = data.weather;
  const aqiInfo = getAqiCategory(data.aqi);

  return (
    <div className="details-grid">
      
      {/* AQI Block */}
      <div className="detail-card">
        <div className="detail-label-container">
          <Activity className="detail-icon" />
          <span className="detail-title">Air Quality</span>
        </div>
        <div className="detail-value">{data.aqi ?? '--'}</div>
        <div className="detail-subtext" style={{ color: aqiInfo.color !== 'inherit' ? aqiInfo.color : 'var(--text-muted)' }}>
          {aqiInfo.text}
        </div>
      </div>

      {/* Precipitation Block */}
      <div className="detail-card">
        <div className="detail-label-container">
          <CloudRain className="detail-icon" />
          <span className="detail-title">Precipitation</span>
        </div>
        <div className="detail-value">{current.precipitation} mm</div>
        <div className="detail-subtext" style={{ color: 'var(--text-muted)' }}>
          Last 24h
        </div>
      </div>

    </div>
  );
};
