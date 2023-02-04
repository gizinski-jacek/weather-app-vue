<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Current from './components/Current.vue';
import Extra from './components/Extra.vue';
import Forecast from './components/Forecast.vue';
import Controls from './components/Controls.vue';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { GeocodingData, WeatherData } from './types/types';

const metric = ref(true);
const apiData = ref<WeatherData | null>(null);

onMounted(async () => {
	try {
		const res: AxiosResponse<WeatherData> = await axios.get(
			`https://api.openweathermap.org/data/2.5/weather?lat=52.374&lon=4.8897&&appid=928d161ba6f0dc16c683b4e736b43792`
		);
		apiData.value = res.data;
	} catch (error) {
		console.error(error);
	}
});

function changeUnits() {
	metric.value = !metric.value;
}

async function searchWeather(query: string) {
	try {
		if (!query) return;
		const resGeocoding: AxiosResponse<GeocodingData[]> = await axios.get(
			`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1appid=928d161ba6f0dc16c683b4e736b43792`
		);
		const resWeather: AxiosResponse<WeatherData> = await axios.get(
			`https://api.openweathermap.org/data/2.5/weather?lat=${resGeocoding.data[0].lat}&lon=${resGeocoding.data[0].lon}&&appid=928d161ba6f0dc16c683b4e736b43792`
		);
		apiData.value = resWeather.data;
	} catch (error) {
		console.error(error);
	}
}
</script>

<template>
	<main>
		<Controls
			@changeUnits="changeUnits"
			@searchWeather="searchWeather"
			:metric="metric"
		/>
		<Current :apiData="apiData" :metric="metric" />
		<Extra :apiData="apiData" :metric="metric" />
		<Forecast :apiData="apiData" :metric="metric" />
	</main>
</template>

<style scoped>
main {
	display: grid;
	grid-template-columns: auto auto auto;
	gap: 2rem;
}
</style>
