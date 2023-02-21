<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Current from "./components/Current.vue";
import Extra from "./components/Extra.vue";
import Forecast from "./components/Forecast.vue";
import Controls from "./components/Controls.vue";
import Spinner from "./components/Spinner.vue";
import type { GeocodingData, OneCallWeatherData, AirPollution } from "./types/types";
import { fetchGeolocation, fetchWeatherOneCall, fetchAirPollution } from "./utilities/fetchers";
import { AxiosError } from 'axios';

const metric = ref<boolean>(true);
const location = ref<GeocodingData | null>({
	lat: 52.3727598,
	lon: 4.8936041,
	country: "NL",
	name: "Amsterdam",
	state: "North Holland",
});
const apiData = ref<OneCallWeatherData | null>(null);
const airPollutionData = ref<AirPollution | null>(null)
const fetching = ref<boolean>(true);
const fetchingError = ref<string | null>(null);

onMounted(async () => {
	try {
		if (!location.value) return;
		fetching.value = true;
		getGeolocation();
		const { lat, lon } = location.value;
		apiData.value = await fetchWeatherOneCall(lat, lon);
		airPollutionData.value = await fetchAirPollution(lat, lon)
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
});

watch(location, async () => {
	try {
		if (!location.value) return;
		fetching.value = true;
		const { lat, lon } = location.value;
		apiData.value = await fetchWeatherOneCall(lat, lon);
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
});

async function changeLocation(query: string) {
	try {
		if (!query) return;
		fetching.value = true;
		location.value = await fetchGeolocation(query);
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

function getGeolocation(): null {
	fetching.value = true;
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(async (position) => {
			const { latitude, longitude } = position.coords;
			const weather = await fetchWeatherOneCall(latitude, longitude);
			if (!weather) throw new Error();
			const query = weather.timezone.split("/")[1];
			const geolocation = await fetchGeolocation(query);
			if (!geolocation) throw new Error();
			location.value = geolocation;
		}, handleGeolocationError);
	} else {
		console.log("Geolocation is not supported by this browser.");
	}
	fetching.value = false;
	return null;
}

function handleGeolocationError(error: GeolocationPositionError) {
	switch (error.code) {
		case error.PERMISSION_DENIED:
			console.log("User denied the request for geolocation.");
			break;
		case error.POSITION_UNAVAILABLE:
			console.log("Geolocation information is unavailable.");
			break;
		case error.TIMEOUT:
			console.log("The request to get user geolocation timed out.");
			break;
		default:
			console.log("An unknown geolocation error occurred.");
			break;
	}
}

function dismissError() {
	fetchingError.value = null
}
</script>

<template>
	<main v-if="apiData">
		<div class="top">
			<div>
				<Controls @changeUnits="changeUnits" @changeLocation="changeLocation" :metric="metric" />
				<Current :weather="apiData" :location="location" :metric="metric" :fetching="fetching" />
			</div>
			<Extra :weather="apiData" :pollution="airPollutionData" :metric="metric" :fetching="fetching" />
		</div>
		<Forecast :weather="apiData" :metric="metric" :fetching="fetching" />
	</main>
	<div v-if="fetchingError" class="error">
		<h3>{{ fetchingError }}</h3>
		<div class="dismiss" @click="dismissError"></div>
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
	text-transform: capitalize;
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
	background-color: rgb(200, 0, 0);
	padding: 0.5rem;
	margin: 0.5rem;
	border-radius: 8px;

	h3 {
		font-weight: 600;
	}

	.dismiss {
		margin: 0;
		margin-left: 5rem;
		width: 24px;
		height: 24px;
		cursor: pointer;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 24px;
			height: 4px;
			background-color: rgb(0, 0, 0);
			transform: translateY(8px) rotate(-45deg);
		}

		&:after {
			transform: translateY(4px) rotate(45deg);
		}

		&:hover:before,
		&:hover:after {
			background-color: var(--color-background-soft);
		}
	}
}

@media (min-width: 640px) {
	.top {
		flex-direction: row;
		gap: 5rem;
	}
}
</style>
