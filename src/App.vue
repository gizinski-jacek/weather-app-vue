<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Current from "./components/Current.vue";
import Extra from "./components/Extra.vue";
import Forecast from "./components/Forecast.vue";
import Controls from "./components/Controls.vue";
import Spinner from "./components/Spinner.vue";
import type { GeocodingData, OneCallWeatherData, AirPollution } from "./types/types";
import { fetchByQuery, fetchByCoords, fetchWeatherOneCall, fetchAirPollution } from "./utilities/fetchers";
import { AxiosError } from 'axios';

const defaultLocation: GeocodingData = {
	lat: 52.3727598,
	lon: 4.8936041,
	country: "NL",
	name: "Amsterdam",
	state: "North Holland",
}

const metric = ref<boolean>(true);
const geolocation = ref<GeocodingData | null>(null);
const searchResults = ref<GeocodingData[] | null>(null)
const apiData = ref<OneCallWeatherData | null>(null);
const airPollutionData = ref<AirPollution | null>(null)
const dataError = ref<string | null>(null);

onMounted(async () => {
	try {
		if (localStorage.userMetric) {
			metric.value = JSON.parse(localStorage.userMetric)
		}
		if (localStorage.userLocation) {
			await updateAppData(JSON.parse(localStorage.userLocation));
		} else {
			await getCurrentLocation()
		}
	} catch (error: any) {
		console.error(error.message)
		geolocation.value = defaultLocation;
	}
});

watch(geolocation, async (newLocation) => {
	try {
		if (!newLocation) return;
		await updateAppData(newLocation)
	} catch (error: any) {
		console.error(error.message)
		if (error instanceof AxiosError) {
			if (error.response?.status === 400) {
				dataError.value = 'City not found. Did you enter correct name?'
			}
		} else {
			dataError.value = 'Request error, try again.'
		}
		if (!apiData) {
			geolocation.value = defaultLocation;
		}
	}
});

async function updateAppData(location: GeocodingData) {
	try {
		const weather = await fetchWeatherOneCall(location.lat, location.lon);
		const pollution = await fetchAirPollution(location.lat, location.lon)
		apiData.value = weather;
		airPollutionData.value = pollution;
		geolocation.value = location;
	} catch (error: any) {
		console.error(error.message)
		throw new Error('Error getting weather data, try again.')
	}
}

async function searchLocation(query: string | GeocodingData) {
	try {
		if (!query) return;
		if (typeof query === 'string') {
			const results = await fetchByQuery(query);
			if (!results.length) {
				throw new Error(`No results for ${query}.`)
			} else {
				searchResults.value = results;
			}
		} else if (typeof query === 'object') {
			const geolocation = await fetchByCoords(query.lat, query.lon);
			await updateAppData(geolocation);
			searchResults.value = null;
		}
		dataError.value = null;
	} catch (error: any) {
		console.error(error.message)
		if (error instanceof AxiosError) {
			if (error.response?.status === 400) {
				dataError.value = 'City not found. Did you enter correct name?'
			}
		} else {
			dataError.value = error.message || 'Error searching for city, try again.'
		}
		searchResults.value = null;
	}
}

function changeUnits() {
	metric.value = !metric.value;
}

function dismissError() {
	dataError.value = null;
}

watch(metric, (newMetric) => {
	localStorage.setItem('userMetric', JSON.stringify(newMetric));
})

async function requestUserGeolocation() {
	try {
		await getCurrentLocation();
	} catch (error: any) {
		console.error(error.message)
		dataError.value = error.message
	}
}

function getCurrentLocation(): Promise<null> {
	return new Promise((resolve, reject) => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					try {
						const { latitude, longitude } = position.coords;
						const geolocation = await fetchByCoords(latitude, longitude);
						await updateAppData(geolocation)
						localStorage.setItem('userLocation', JSON.stringify(geolocation))
						resolve(null)
					} catch (error: any) {
						reject(error)
					}
				}, (error) =>
				reject(new Error('Geolocation request error.'))
			)
		} else {
			reject(new Error('Geolocation is not supported by this browser.'))
		}
	});
};

</script>

<template>
	<main v-if="apiData">
		<div class="top">
			<div class="basic">
				<Controls @changeUnits="changeUnits" @searchLocation="searchLocation"
					@requestUserGeolocation="requestUserGeolocation" :metric="metric" :searchResults="searchResults" />
				<Current :weather="apiData" :location="geolocation" :metric="metric" />
			</div>
			<Extra :weather="apiData" :pollution="airPollutionData" :metric="metric" />
		</div>
		<Forecast :weather="apiData" :metric="metric" />
		<div v-if="dataError" class="error" @click="dismissError">
			<h4>{{ dataError }}</h4>
		</div>
	</main>
	<Spinner v-else />
</template>

<style scoped lang="scss">
main {
	height: 100%;
	max-width: 1300px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 2rem;
	margin: 0 auto;
	padding: 1rem;
	position: relative;
}

.top {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 2rem;
}

.error {
	position: absolute;
	top: 0;
	left: 50%;
	transform: translateX(-50%);
	min-width: 280px;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: var(--color-red);
	border: 3px solid var(--color-text-alt);
	padding: 1rem 2rem;
	margin: 0.5rem;
	border-radius: 8px;
	z-index: 100;
	cursor: pointer;

	h4 {
		font-weight: 700;
	}
}

@media (min-width: 640px) {
	.top {
		flex-direction: row;
		gap: 5rem;

		.basic {
			flex: 1;
			max-width: 450px;
		}
	}
}
</style>