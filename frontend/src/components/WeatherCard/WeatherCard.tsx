import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { WeatherData } from '../../types/weather';
import { CurrentWeather } from '../CurrentWeather/CurrentWeather';
import { HourlyForecast } from '../HourlyForecast/HourlyForecast';
import { DetailsGrid } from '../DetailsGrid/DetailsGrid';
import { SearchBar } from '../SearchBar/SearchBar';
import { useColorTheme, type PresetColor } from '../../contexts/ColorThemeContext';
import { useUnit } from '../../contexts/UnitContext';
import './WeatherCard.css';

interface WeatherCardProps {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  onSearch: (city: string) => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ data, loading, error, onSearch }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { color, setColor } = useColorTheme();
  const { unit, toggleUnit } = useUnit();

  // GSAP animation for initial load
  useEffect(() => {
    if (!loading && data && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
      
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out", delay: 0.2 }
        );
      }
    }
  }, [loading, data]);

  const renderColorDot = (c: PresetColor, hex: string) => (
    <button 
      key={c}
      className={`color-dot ${color === c ? 'active' : ''}`}
      style={{ backgroundColor: hex }}
      onClick={() => setColor(c)}
      aria-label={`Select ${c} theme`}
    />
  );

  return (
    <div className="weather-card-container realistic-card" ref={cardRef}>
      
      {/* Top Header: Theme switcher (Left), Unit Switcher (Right) */}
      <div className="card-header">
        <div className="theme-selector">
          {renderColorDot('neutral', '#94a3b8')}
          {renderColorDot('blue', '#3b82f6')}
          {renderColorDot('mint', '#10b981')}
          {renderColorDot('sand', '#d97706')}
        </div>
        <div className="unit-toggle">
          <button 
            className={`unit-btn ${unit === 'celsius' ? 'active' : ''}`}
            onClick={() => unit !== 'celsius' && toggleUnit()}
          >
            °C
          </button>
          <span>|</span>
          <button 
            className={`unit-btn ${unit === 'fahrenheit' ? 'active' : ''}`}
            onClick={() => unit !== 'fahrenheit' && toggleUnit()}
          >
            °F
          </button>
        </div>
      </div>

      <div className="card-body">
        <SearchBar onSearch={onSearch} />

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Fetching weather...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : data ? (
          <div ref={contentRef} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* The main temp logic got moved above card in App.tsx, so CurrentWeather will be smaller */}
            <CurrentWeather data={data} omitTemp={true} />
            
            <HourlyForecast data={data} />
            
            {/* Contains strictly AQI and Precipitation metrics natively built-in now, but we can reuse DetailsGrid slightly modified */}
            <DetailsGrid data={data} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
