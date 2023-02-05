<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Current from './components/Current.vue';
import Extra from './components/Extra.vue';
import Forecast from './components/Forecast.vue';
import Controls from './components/Controls.vue';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { GeocodingData, WeatherData } from './types/types';

const metric = ref<Boolean>(true);
const geolocation = ref<{ latitude: number, longitude: number }>({ latitude: 52.374, longitude: 4.8897 });
const apiData = ref<WeatherData | null>(null);
const fetching = ref<Boolean>(true);

onMounted(async () => {
	try {
		getGeolocation()
		const res: AxiosResponse<WeatherData> = await axios.get(
			`https://api.openweathermap.org/data/2.5/weather?lat=52.374&lon=4.8897&&appid=${import.meta.env.VITE_API_KEY}`
		);
		apiData.value = res.data;
		fetching.value = false
	} catch (error) {
		console.error(error);
		fetching.value = false
	}
});

watch(geolocation, async () => {
	fetching.value = true
	const res: AxiosResponse<WeatherData> = await axios.get(
		`https://api.openweathermap.org/data/2.5/weather?lat=${geolocation.value.latitude}&lon=${geolocation.value.longitude}&appid=${import.meta.env.VITE_API_KEY}`
	);
	apiData.value = res.data;
	fetching.value = false
})


function changeUnits() {
	metric.value = !metric.value;
}

function getGeolocation(): GeolocationPosition | null {
	fetching.value = true
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((location) => {
			const { latitude, longitude } = location.coords
			geolocation.value = { latitude, longitude }
		}, handleGeolocationError);
	} else {
		console.log('Geolocation is not supported by this browser.');
	}
	fetching.value = false
	return null;
}

function handleGeolocationError(error: GeolocationPositionError) {
	switch (error.code) {
		case error.PERMISSION_DENIED:
			console.log('User denied the request for geolocation.');
			break;
		case error.POSITION_UNAVAILABLE:
			console.log('Geolocation information is unavailable.');
			break;
		case error.TIMEOUT:
			console.log('The request to get user geolocation timed out.');
			break;
		default:
			console.log('An unknown geolocation error occurred.');
			break;
	}
}

async function searchWeather(query: string) {
	try {
		if (!query) return;
		const resGeocoding: AxiosResponse<GeocodingData[]> = await axios.get(
			`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1appid=${import.meta.env.VITE_API_KEY}`
		);
		const resWeather: AxiosResponse<WeatherData> = await axios.get(
			`https://api.openweathermap.org/data/2.5/weather?lat=${resGeocoding.data[0].lat}&lon=${resGeocoding.data[0].lon}&&appid=${import.meta.env.VITE_API_KEY}`
		);
		apiData.value = resWeather.data;
	} catch (error) {
		console.error(error);
	}
}

</script>
<template>
	<main>
		<Controls @changeUnits="changeUnits" @searchWeather="searchWeather" :metric="metric" />
		<Current :apiData="apiData" :metric="metric" :fetching="fetching" />
		<Extra :apiData="apiData" :metric="metric" :fetching="fetching" />
		<Forecast :apiData="apiData" :metric="metric" :fetching="fetching" />
	</main>
</template>

<style scoped>
main {
	display: grid;
	grid-template-columns: auto auto auto;
	gap: 2rem;
}
</style>
