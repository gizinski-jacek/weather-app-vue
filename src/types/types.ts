export interface GeocodingData {
	name: string;
	lat: number;
	lon: number;
	country: string;
	state: string;
}
[];

export interface OneCallWeatherData {
	lat: number;
	lon: number;
	timezone: string;
	timezone_offset: number;
	current: {
		dt: number;
		sunrise: number;
		sunset: number;
		temp: number;
		feels_like: number;
		pressure: number;
		humidity: number;
		dew_point: number;
		uvi: number;
		clouds: number;
		visibility: number;
		wind_speed: number;
		wind_deg: number;
		wind_gust?: number;
		rain?: { '1h': number };
		snow?: { '1h': number };
		weather: { id: number; main: string; description: string; icon: string }[];
	};
	daily: DailyForecast[];
	hourly: HourlyForecast[];
	alerts?: {
		sender_name: string;
		event: string;
		start: number;
		end: number;
		description: string;
		tags: string[];
	};
}

export interface HourlyForecast {
	clouds: number;
	dew_point: number;
	dt: number;
	feels_like: number;
	humidity: number;
	pop: number;
	pressure: number;
	temp: number;
	uvi: number;
	visibility: number;
	weather: { id: number; main: string; description: string; icon: string }[];
	wind_deg: number;
	wind_gust?: number;
	wind_speed: number;
	rain?: { '1h': number };
	snow?: { '1h': number };
}

export interface DailyForecast {
	clouds: number;
	dew_point: number;
	dt: number;
	feels_like: {
		day: number;
		eve: number;
		morn: number;
		night: number;
	};
	humidity: number;
	moon_phase: number;
	moonrise: number;
	moonset: number;
	pop: number;
	pressure: number;
	sunrise: number;
	sunset: number;
	temp: {
		day: number;
		eve: number;
		max: number;
		min: number;
		morn: number;
		night: number;
	};
	uvi: number;
	weather: { id: number; main: string; description: string; icon: string }[];
	wind_deg: number;
	wind_gust?: number;
	wind_speed: number;
}

export interface AirPollution {
	coord: { lat: number; lon: number };
	list: {
		dt: number;
		main: { aqi: number };
		components: {
			co: number;
			no: number;
			no2: number;
			o3: number;
			so2: number;
			pm2_5: number;
			pm10: number;
			nh3: number;
		};
	}[];
}
