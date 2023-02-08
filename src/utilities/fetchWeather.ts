import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { GeocodingData, OneCallWeatherData } from '../types/types';

export async function fetchGeolocation(
	query: string
): Promise<GeocodingData | null> {
	try {
		const res: AxiosResponse<GeocodingData[]> = await axios.get(
			`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${
				import.meta.env.VITE_API_KEY
			}`
		);
		return res.data[0];
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function fetchWeatherOneCall(
	lat: number,
	lon: number
): Promise<OneCallWeatherData | null> {
	try {
		const res: AxiosResponse<OneCallWeatherData> = await axios.get(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${
				import.meta.env.VITE_API_KEY
			}&units=metric`
		);
		return res.data;
	} catch (error) {
		console.error(error);
		return null;
	}
}
