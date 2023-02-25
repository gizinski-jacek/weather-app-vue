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
const location = ref<GeocodingData | null>(null);
const apiData = ref<OneCallWeatherData | null>(null);
const airPollutionData = ref<AirPollution | null>(null)
const fetching = ref<boolean>(false);
const fetchingError = ref<string | null>(null);

onMounted(async () => {
	try {
		fetching.value = true;
		if (localStorage.userMetric) {
			metric.value = JSON.parse(localStorage.userMetric)
		}
		if (localStorage.userLocation) {
			location.value = JSON.parse(localStorage.userLocation)
		} else {
			await getCurrentLocation()
			fetching.value = false;
		}
	} catch (error: any) {
		console.log(error.message)
		location.value = defaultLocation;
		fetching.value = false;
	}
});

async function updateWeatherData(lat: number, lon: number) {
	try {
		fetching.value = true;
		apiData.value = await fetchWeatherOneCall(lat, lon);
		airPollutionData.value = await fetchAirPollution(lat, lon)
		fetching.value = false;
	} catch (error) {
		console.log(error)
	}
}

watch(metric, (newMetric) => {
	localStorage.setItem('userMetric', JSON.stringify(newMetric));
})

watch(location, async (newLocation) => {
	try {
		if (!newLocation) return;
		const { lat, lon } = newLocation;
		await updateWeatherData(lat, lon)
	} catch (error: any) {
		console.error(error.message)
		if (error instanceof AxiosError) {
			if (error.response?.status === 400) {
				fetchingError.value = 'City not found. Did you enter correct name?'
			}
		} else {
			fetchingError.value = 'Request error, try again.'
		}
		fetching.value = false;
	}
});

async function searchLocation(query: string) {
	try {
		if (!query) return;
		fetching.value = true;
		const geolocation = await fetchByQuery(query);
		location.value = geolocation;
		fetching.value = false;
	} catch (error: any) {
		console.error(error.message)
		if (error instanceof AxiosError) {
			if (error.response?.status === 400) {
				fetchingError.value = 'City not found. Did you enter correct name?'
			}
		} else {
			fetchingError.value = 'Request error, try again.'
		}
		fetching.value = false;
	}
}

function changeUnits() {
	metric.value = !metric.value;
}

async function requestUserGeolocation() {
	try {
		fetching.value = true
		await getCurrentLocation();
		fetching.value = false;
	} catch (error: any) {
		if (error.type === 'Unsupported') {
			console.log(error.message)
		} else if (error.name === 'PositionError') {
			fetchingError.value = error.message
			fetching.value = false;
		} else {
			console.error(error.message)
			fetchingError.value = error.message
		}
		fetching.value = false;
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
						location.value = geolocation;
						localStorage.setItem('userLocation', JSON.stringify(geolocation))
						resolve(null)
					} catch (error: any) {
						reject(error)
					}
				}, (error) =>
				reject(new Error('Geolocation request error. Displaying default location: Amsterdam.'))
			)
		} else {
			reject(new Error('Geolocation is not supported by this browser'))
		}
	});
};

function dismissError() {
	fetchingError.value = null
}
</script>

<template>
	<main v-if="apiData">
		<div class="top">
			<div>
				<Controls @changeUnits="changeUnits" @searchLocation="searchLocation"
					@requestUserGeolocation="requestUserGeolocation" :metric="metric" />
				<Current :weather="apiData" :location="location" :metric="metric" :fetching="fetching" />
			</div>
			<Extra :weather="apiData" :pollution="airPollutionData" :metric="metric" :fetching="fetching" />
		</div>
		<Forecast :weather="apiData" :metric="metric" :fetching="fetching" />
	</main>
	<div v-if="fetchingError" class="error" @click="dismissError">
		<h4>{{ fetchingError }}</h4>
	</div>
	<Spinner v-if="fetching" />
</template>

<style scoped lang="scss">
main {
	min-height: 100vh;
	max-width: 1300px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 2rem;
	margin: 0 auto;
	padding: 1rem;
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
	left: 0;
	display: flex;
	background-color: var(--color-red);
	padding: 0.5rem;
	margin: 0.5rem;
	border-radius: 8px;
	z-index: 50;
	cursor: pointer;

	h4 {
		font-weight: 700;
	}
}

@media (min-width: 640px) {
	.top {
		flex-direction: row;
		gap: 5rem;
	}
}
</style>