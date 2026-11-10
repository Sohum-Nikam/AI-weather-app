# 🌤️ Simple Weather App

A full-stack weather application: search any city and get current conditions, a 24-hour temperature forecast, air quality and precipitation — in a clean, themeable card UI.

**Live demo:** `[Add live demo URL here]` · **Repo:** https://github.com/Sohum-Nikam/simple-weather-app

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

The project is split into two packages:

- **`frontend/`** – a React 19 + TypeScript single-page app built with Vite.
- **`backend/`** – a TypeScript Express server exposing one endpoint, `GET /api/weather`, which calls the [WeatherAPI.com](https://www.weatherapi.com/) forecast API, so the API key never reaches the browser, and returns a normalised JSON payload.

On first load the app automatically searches for **London**.

## Features

- 🔍 **City search** with loading and error states
- 🌡️ **Current conditions**: location name, region/country, condition icon and description, large temperature display
- 📊 **24-hour forecast** rendered as a temperature bar chart starting from the current hour
- 🌫️ **Air Quality** card (US EPA index 1–6 mapped to labels from "Good" to "Hazardous")
- 🌧️ **Precipitation** card (mm)
- 🔁 **°C / °F toggle**
- 🌗 **Light / dark theme** (defaults to the system preference)
- 🎨 **Four accent colours**: neutral, blue, mint, sand
- 💾 **Persistent preferences** (unit, theme, accent colour) in `localStorage`
- ✨ **GSAP** entrance animations
- 🛡️ **Backend proxy** with input validation and mapped error responses (400 missing city, 401 invalid key, 404 city not found, 500 otherwise)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React `^19.2.4`, TypeScript `~6.0.2`, Vite `^8.0.4` |
| UI libraries | GSAP `^3.15.0`, lucide-react `^1.8.0`, date-fns `^4.1.0` (declared) |
| Backend | Node.js, Express `^5.2.1`, CORS `^2.8.6`, dotenv `^17.4.2`, Axios `^1.15.0` |
| Backend tooling | ts-node `^10.9.2`, TypeScript `^6.0.3` |
| Dev tooling | concurrently `^9.2.1` (root), ESLint `^9.39.4` + typescript-eslint (frontend) |
| Data provider | [WeatherAPI.com](https://www.weatherapi.com/) `forecast.json` (2 days, AQI enabled) |

> Versions are taken from the `package.json` files in the repository.

## Folder Structure

```text
simple-weather-app/
├── package.json            # root: `dev` script runs frontend + backend together
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── index.ts        # Express server, /api/weather endpoint
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── components/     # SearchBar, WeatherCard, CurrentWeather,
        │                   # HourlyForecast, DetailsGrid, Controls
        ├── contexts/       # ThemeContext, UnitContext, ColorThemeContext
        ├── hooks/          # useWeather.ts
        ├── services/       # api.ts (calls the backend)
        ├── types/          # weather.ts
        └── utils/          # weather.ts (icons, unit conversion, AQI labels)
```

## Installation

**Prerequisites:** Node.js and npm, plus a free [WeatherAPI.com](https://www.weatherapi.com/) API key. *(Minimum Node version is not specified in the repo.)*

```bash
git clone https://github.com/Sohum-Nikam/simple-weather-app.git
cd simple-weather-app

# root (provides `concurrently`)
npm install

# backend
cd backend && npm install && cd ..

# frontend
cd frontend && npm install && cd ..
```

> ⚠️ **Known issue:** `frontend/src/services/api.ts` imports `axios`, but `axios` is not listed in `frontend/package.json`. If the frontend fails to start with an unresolved-import error, run `npm install axios` inside `frontend/`.

## Configuration

Create two `.env` files (copy the variable names below; never commit real keys).

**`backend/.env`**

```env
PORT=5001
WEATHER_API_KEY=your_weatherapi_key_here
```

**`frontend/.env`**

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

| Variable | Where | Required | Default |
|---|---|---|---|
| `WEATHER_API_KEY` | backend | **Yes** | — (requests fail without it) |
| `PORT` | backend | No | `5001` |
| `VITE_API_BASE_URL` | frontend | No | `http://localhost:5001/api` |

## Usage

From the repository root, start both servers:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev --prefix backend     # ts-node src/index.ts
npm run dev --prefix frontend    # vite
```

Open the URL Vite prints (Vite's default is `http://localhost:5173`; not confirmed in the repo), type a city and press **Search**. Use the top-left dots to change accent colour, the top-right toggle for °C/°F, and the sun/moon button for light/dark mode.

Other frontend scripts: `npm run build --prefix frontend` (type-check + production build), `npm run lint --prefix frontend`, `npm run preview --prefix frontend`. There are no automated tests (`npm test` is a placeholder).

## API Reference

`GET /api/weather?city=<name>`

Returns `{ location, weather: { current, hourly, daily }, aqi }`, normalised from WeatherAPI's response (field names follow the frontend's `WeatherData` type).

| Status | Meaning |
|---|---|
| 200 | Weather data |
| 400 | `city` query parameter missing |
| 401 | Invalid/missing API key |
| 404 | City not found |
| 500 | Other upstream/server failure |

## Screenshots

> `[Add screenshots here — none are included in the repository]`

| Light mode | Dark mode |
|---|---|
| `docs/screenshot-light.png` | `docs/screenshot-dark.png` |

## Deployment

> `[Deployment not yet configured / not verifiable from the repository]`

Suggested placeholders to fill in:
- **Frontend:** `[host, e.g. Vercel/Netlify — build: npm run build, output: frontend/dist]`
- **Backend:** `[host — start command; set WEATHER_API_KEY and PORT]`
- Set `VITE_API_BASE_URL` to the deployed backend's `/api` URL at build time.

Note: the backend only has a `dev` script (ts-node); a production `build`/`start` script isn't defined yet.

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push and open a Pull Request

## License

The root `package.json` declares **ISC**, but the repository has no `LICENSE` file. `[Add a LICENSE file to confirm.]`

## Acknowledgements

Weather data by [WeatherAPI.com](https://www.weatherapi.com/). Icons by [Lucide](https://lucide.dev/).
