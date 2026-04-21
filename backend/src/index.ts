import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

app.use(cors());
app.use(express.json());

if (!WEATHER_API_KEY) {
  console.warn('⚠️  WEATHER_API_KEY is not set in .env — requests will fail.');
}

app.get('/api/weather', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }

    // Fetch current weather + 2 days of hourly forecast + AQI in one call
    const endpoint = `https://api.weatherapi.com/v1/forecast.json`;
    const response = await axios.get(endpoint, {
      params: {
        key: WEATHER_API_KEY,
        q: city,
        days: 2,
        aqi: 'yes',
      },
    });

    const raw = response.data;

    // Flatten both forecast days into a single hourly array
    const allHours = [
      ...raw.forecast.forecastday[0].hour,
      ...(raw.forecast.forecastday[1]?.hour ?? []),
    ];

    // Normalize into the shape the frontend expects (WeatherData interface)
    const normalized = {
      location: {
        name: raw.location.name,
        region: raw.location.region,
        country: raw.location.country,
      },
      weather: {
        current: {
          temperature_2m: raw.current.temp_c,
          relative_humidity_2m: raw.current.humidity,
          apparent_temperature: raw.current.feelslike_c,
          is_day: raw.current.is_day,
          precipitation: raw.current.precip_mm,
          weather_code: raw.current.condition.code,
          wind_speed_10m: raw.current.wind_kph,
        },
        hourly: {
          time: allHours.map((h: any) => h.time),
          temperature_2m: allHours.map((h: any) => h.temp_c),
          weather_code: allHours.map((h: any) => h.condition.code),
          precipitation_probability: allHours.map((h: any) => h.chance_of_rain),
          visibility: allHours.map((h: any) => h.vis_km),
        },
        daily: {
          time: raw.forecast.forecastday.map((d: any) => d.date),
          weather_code: raw.forecast.forecastday.map((d: any) => d.day.condition.code),
          temperature_2m_max: raw.forecast.forecastday.map((d: any) => d.day.maxtemp_c),
          temperature_2m_min: raw.forecast.forecastday.map((d: any) => d.day.mintemp_c),
          sunrise: raw.forecast.forecastday.map((d: any) => d.astro.sunrise),
          sunset: raw.forecast.forecastday.map((d: any) => d.astro.sunset),
          uv_index_max: raw.forecast.forecastday.map((d: any) => d.day.uv),
        },
      },
      // WeatherAPI's US EPA AQI index (1–6 scale) — we scale it to 0–300 range for display
      aqi: raw.current.air_quality?.['us-epa-index'] ?? null,
    };

    res.json(normalized);
  } catch (error: any) {
    const status = error.response?.status;
    const msg = error.response?.data?.error?.message;

    if (status === 401 || status === 403) {
      return res.status(401).json({ error: 'Invalid API key. Check your WEATHER_API_KEY.' });
    }
    if (status === 400) {
      return res.status(404).json({ error: msg || 'City not found.' });
    }

    console.error('Weather API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data.' });
  }
});

app.listen(PORT, () => {
  console.log(`📡 Backend running on http://localhost:${PORT}`);
});
