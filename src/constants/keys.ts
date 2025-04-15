export const OPENWEATHER_GEO_API_URL =
  import.meta.env.VITE_OPENWEATHER_GEO_API_URL ||
  'https://api.openweathermap.org/geo/1.0';
export const OPENWEATHER_API_URL =
  import.meta.env.VITE_OPENWEATHER_API_URL ||
  'https://api.openweathermap.org/data/2.5';

// For review
export const OPENWEATHER_API_KEY =
  import.meta.env.VITE_OPENWEATHER_API_KEY ||
  'f593f86e24c321b810290a90d06930db';

export const DB_NAME = 'WEATHER_APP_DB';
export const DB_VERSION = 1;
export const LOCATIONS_STORE = 'LOCATIONS_STORE';
export const WEATHER_STORE = 'WEATHER_STORE';
export const FORECAST_STORE = 'FORECAST_STORE';
