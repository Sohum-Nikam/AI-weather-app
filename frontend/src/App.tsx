import React from 'react';
import { WeatherCard } from './components/WeatherCard/WeatherCard';
import { Controls } from './components/Controls/Controls';
import { useWeather } from './hooks/useWeather';
import { useUnit } from './contexts/UnitContext';
import { celsiusToFahrenheit } from './utils/weather';
import './App.css';

function App() {
  const { data, loading, error, searchCity } = useWeather();
  const { unit } = useUnit();

  // Initial load
  React.useEffect(() => {
    searchCity('London');
  }, [searchCity]);

  // Compute exact temp to render above the card elegantly
  let displayTemp = null;
  if (data) {
    const rawTemp = data.weather.current.temperature_2m;
    displayTemp = unit === 'celsius' ? Math.round(rawTemp) : Math.round(celsiusToFahrenheit(rawTemp));
  }

  return (
    <div className="app-container">
      <div id="global-backdrop"></div>
      
      {/* Global toggle moved top-right handled inside Controls */}
      <Controls />
      
      <header className="header">
        {data && !loading && !error && (
          <h1 className="large-temp-display">
            {displayTemp}°
          </h1>
        )}
      </header>
      
      <main className="main-content">
        <WeatherCard 
          data={data} 
          loading={loading} 
          error={error} 
          onSearch={searchCity} 
        />
      </main>
    </div>
  );
}

export default App;
