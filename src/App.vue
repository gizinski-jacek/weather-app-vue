<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Current from "./components/Current.vue";
import Extra from "./components/Extra.vue";
import Forecast from "./components/Forecast.vue";
import Controls from "./components/Controls.vue";
import Spinner from "./components/Spinner.vue";
import Footer from "./components/Footer.vue";
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
const searchResults = ref<GeocodingData[] | null>(null);
const apiData = ref<OneCallWeatherData | null>(null);
const airPollutionData = ref<AirPollution | null>(null);
const dataError = ref<string | null>(null);
const themeLight = ref<boolean>(false);

onMounted(async () => {
	try {
		const preferLight = window.matchMedia(
			'(prefers-color-scheme: light)'
		).matches;
		if (localStorage.themeLight) {
			themeLight.value = JSON.parse(localStorage.themeLight);
		} else {
			themeLight.value = preferLight;
		}
		if (localStorage.userMetric) {
			metric.value = JSON.parse(localStorage.userMetric);
		}
		if (localStorage.userLocation) {
			await updateAppData(JSON.parse(localStorage.userLocation));
		} else {
			await getCurrentLocation();
		}
	} catch (error: any) {
		geolocation.value = defaultLocation;
	}
});

watch(geolocation, async (newLocation) => {
	try {
		if (!newLocation) return;
		await updateAppData(newLocation)
	} catch (error: any) {
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

watch(metric, (newMetric) => {
	localStorage.setItem('userMetric', JSON.stringify(newMetric));
})

watch(searchResults, (newSearchResults) => {
	if (newSearchResults) {
		document.body.addEventListener('click', watchResultsClick)
	}
})

watch(themeLight, (newThemeLight) => {
	localStorage.setItem('themeLight', JSON.stringify(newThemeLight));
})

function changeUnits() {
	metric.value = !metric.value;
}

function dismissError() {
	dataError.value = null;
}

function clearSearchResults() {
	searchResults.value = null
}

function watchResultsClick(e: MouseEvent) {
	const el = e.target as HTMLDivElement
	if (el.className !== 'result') {
		clearSearchResults()
		document.body.removeEventListener('click', watchResultsClick)
	}
}

function toggleTheme() {
	themeLight.value = !themeLight.value
}

async function updateAppData(location: GeocodingData) {
	try {
		const weather = await fetchWeatherOneCall(location.lat, location.lon);
		const pollution = await fetchAirPollution(location.lat, location.lon)
		apiData.value = weather;
		airPollutionData.value = pollution;
		geolocation.value = location;
	} catch (error: any) {
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
		if (error instanceof AxiosError) {
			if (error.response?.status === 400) {
				dataError.value = 'City not found.'
			}
		} else {
			dataError.value = error.message || 'Error searching for city, try again.'
		}
		searchResults.value = null;
	}
}

async function requestLocation() {
	try {
		dataError.value = null
		await getCurrentLocation();
	} catch (error: any) {
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
				}, (error) => {
					switch (error.code) {
						case 1:
							reject(new Error('Geolocation request denied. Change browser setting to allow geolocation to use this function.'))
							break;
						case 2:
							reject(new Error('Geolocation unavailable.'))
							break;
						case 3:
							reject(new Error('Geolocation request timeout.'))
							break;
						default:
							reject(new Error('Geolocation request error.'))
							break;
					}
				}, { timeout: 5000, }
			)
		} else {
			reject(new Error('Geolocation is not supported by this browser.'))
		}
	});
};
</script>

<template>
	<div class="main-container" :class="{ light: themeLight }">
		<main v-if="apiData">
			<div class="top">
				<section class="basic">
					<Controls @changeUnits="changeUnits" @searchLocation="searchLocation" @requestLocation="requestLocation"
						@clearResults="clearSearchResults" @toggleTheme="toggleTheme" :metric="metric"
						:searchResults="searchResults" :themeLight="themeLight" />
					<Current :weather="apiData" :location="geolocation" :metric="metric" />
				</section>
				<Extra :weather="apiData" :pollution="airPollutionData" :metric="metric" />
			</div>
			<Forecast :weather="apiData" :metric="metric" />
			<div v-if="dataError" class="error" @click="dismissError">
				<h4>{{ dataError }}</h4>
			</div>
			<Footer></Footer>
		</main>
		<Spinner v-else />
	</div>
</template>

<style scoped lang="scss">
.main-container {
	min-height: 100vh;
	color: var(--color-text);
	background-color: var(--color-background-soft);
	transition: 0.35s ease-in-out;
}

main {
	min-height: 100vh;
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
	border: 3px solid var(--color-border-active);
	padding: 1rem;
	margin: 0.5rem;
	border-radius: 8px;
	z-index: 100;
	cursor: pointer;
	transition: 0.925 ease-in-out;
	-webkit-transition: all 0.35s ease-in-out, color 0s;
}

@media (min-width: 640px) {
	.top {
		flex-direction: row;
		gap: 3rem;
	}

	.basic {
		flex: 1;
		max-width: 450px;
	}
}
</style>