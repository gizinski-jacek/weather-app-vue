export interface GeocodingData {
  name: string;
  lat: string;
  lon: string;
  country: string;
  state?: string;
}
[];

export interface WeatherData {
  coord: { lat: number; lon: number };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: { speed: number; deg: number; gust?: number };
  rain?: { "1h": number; "3h": number };
  clouds: { all: number };
  snow?: { "1h": number; "3h": number };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
}
