import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type {
	GeocodingData,
	OneCallWeatherData,
	AirPollution,
} from '@/types/types';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { Geolocation } from '@capacitor/geolocation';
import type { Position } from '@capacitor/geolocation/dist/esm';

const API_KEY =
	import.meta.env.MODE === 'development'
		? import.meta.env.API_KEY_DEV
		: import.meta.env.API_KEY;

export function getLocation(): Promise<GeocodingData> {
	return new Promise(async (resolve, reject) => {
		try {
			if (Capacitor.isNativePlatform()) {
				const geolocation: Position = await Geolocation.getCurrentPosition();
				const locationData = await getLocationByCoords(
					geolocation.coords.latitude,
					geolocation.coords.longitude
				);
				await Preferences.set({
					key: 'userLocation',
					value: JSON.stringify(locationData),
				});
				resolve(locationData);
			} else {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
						async (position) => {
							const { latitude, longitude } = position.coords;
							const geolocation = await getLocationByCoords(
								latitude,
								longitude
							);
							localStorage.setItem('userLocation', JSON.stringify(geolocation));
							resolve(geolocation);
						},
						(error) => {
							switch (error.code) {
								case 1:
									reject(
										new Error(
											'Geolocation request denied. Change browser setting to allow geolocation to use this function.'
										)
									);
									break;
								case 2:
									reject(new Error('Geolocation unavailable.'));
									break;
								case 3:
									reject(new Error('Geolocation request timeout.'));
									break;
								default:
									reject(new Error('Geolocation request error.'));
									break;
							}
						},
						{ timeout: 5000 }
					);
				} else {
					reject(new Error('Geolocation is not supported by this browser.'));
				}
			}
		} catch (error) {
			reject(error);
		}
	});
}

export async function getLocationByQuery(
	query: string
): Promise<GeocodingData[]> {
	try {
		const res: AxiosResponse<GeocodingData[]> = await axios.get(
			`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`,
			{ timeout: 10000 }
		);
		return res.data;
	} catch (error: any) {
		throw error;
	}
}

export async function getLocationByCoords(
	lat: number,
	lon: number
): Promise<GeocodingData> {
	try {
		const res: AxiosResponse<GeocodingData[]> = await axios.get(
			`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`,
			{ timeout: 10000 }
		);
		return res.data[0];
	} catch (error: any) {
		throw error;
	}
}

export async function getWeatherOneCall(
	lat: number,
	lon: number
): Promise<OneCallWeatherData> {
	try {
		const res: AxiosResponse<OneCallWeatherData> = await axios.get(
			`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
			{ timeout: 10000 }
		);
		return res.data;
	} catch (error: any) {
		throw error;
	}
}

export async function getAirPollution(
	lat: number,
	lon: number
): Promise<AirPollution> {
	try {
		const res: AxiosResponse<AirPollution> = await axios.get(
			`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
			{ timeout: 10000 }
		);
		return res.data;
	} catch (error: any) {
		throw error;
	}
}

export async function getWeatherData(
	lat: number,
	lon: number
): Promise<{ weather: OneCallWeatherData; airPollution: AirPollution }> {
	try {
		const weather = await getWeatherOneCall(lat, lon);
		const airPollution = await getAirPollution(lat, lon);
		return { weather: weather, airPollution: airPollution };
	} catch (error: any) {
		throw error;
	}
}
