export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  weather: {
    current: {
      temperature_2m: number;
      relative_humidity_2m: number;
      apparent_temperature: number;
      is_day: number;
      precipitation: number;
      weather_code: number;
      wind_speed_10m: number;
    };
    hourly: {
      time: string[];
      temperature_2m: number[];
      weather_code: number[];
      precipitation_probability: number[];
      visibility: number[];
    };
    daily: {
      time: string[];
      weather_code: number[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      sunrise: string[];
      sunset: string[];
      uv_index_max: number[];
    };
  };
  aqi: number | null;
}
