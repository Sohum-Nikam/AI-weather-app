import { CloudRain, CloudSnow, CloudFog, CloudLightning, Sun, Cloud, CloudSun, Moon, CloudMoon, CloudDrizzle } from 'lucide-react';

/**
 * Maps WeatherAPI.com condition codes to Lucide icons & descriptions.
 * Full code list: https://www.weatherapi.com/docs/weather_conditions.json
 */
export const getWeatherInfo = (code: number, isDay: boolean = true) => {
  // Clear
  if (code === 1000) {
    return { icon: isDay ? Sun : Moon, description: 'Clear' };
  }

  // Partly cloudy / Overcast
  if (code === 1003) {
    return { icon: isDay ? CloudSun : CloudMoon, description: 'Partly cloudy' };
  }
  if (code === 1006) {
    return { icon: Cloud, description: 'Cloudy' };
  }
  if (code === 1009) {
    return { icon: Cloud, description: 'Overcast' };
  }

  // Fog / Mist
  if ([1030, 1135, 1147].includes(code)) {
    return { icon: CloudFog, description: 'Fog' };
  }

  // Drizzle
  if ([1150, 1153, 1168, 1171].includes(code)) {
    return { icon: CloudDrizzle, description: 'Drizzle' };
  }

  // Rain (light/moderate/heavy + freezing)
  if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(code)) {
    return { icon: CloudRain, description: 'Rain' };
  }

  // Snow
  if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258, 1279, 1282].includes(code)) {
    return { icon: CloudSnow, description: 'Snow' };
  }

  // Sleet / Ice
  if ([1069, 1072, 1204, 1207, 1249, 1252].includes(code)) {
    return { icon: CloudSnow, description: 'Sleet' };
  }

  // Thunderstorm
  if ([1087, 1273, 1276].includes(code)) {
    return { icon: CloudLightning, description: 'Thunderstorm' };
  }

  // Blizzard / Patchy variants — treat as snow
  if ([1237, 1261, 1264].includes(code)) {
    return { icon: CloudSnow, description: 'Ice' };
  }

  // Default fallback
  return { icon: Cloud, description: 'Unknown' };
};

export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9) / 5 + 32;
};

export const formatTime = (timeStr: string): string => {
  // WeatherAPI returns "2024-01-01 14:00" — parse accordingly
  const date = new Date(timeStr.replace(' ', 'T'));
  return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
};

export const getAqiCategory = (aqi: number | null): { text: string; color: string } => {
  if (aqi === null) return { text: 'N/A', color: 'inherit' };
  // WeatherAPI US EPA index is 1-6
  if (aqi === 1) return { text: 'Good', color: '#4ade80' };
  if (aqi === 2) return { text: 'Moderate', color: '#facc15' };
  if (aqi === 3) return { text: 'Unhealthy (Sensitive)', color: '#fb923c' };
  if (aqi === 4) return { text: 'Unhealthy', color: '#f87171' };
  if (aqi === 5) return { text: 'Very Unhealthy', color: '#c084fc' };
  return { text: 'Hazardous', color: '#9f1239' };
};
