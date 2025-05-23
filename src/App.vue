<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Current from "./components/Current.vue";
import Extra from "./components/Extra.vue";
import Forecast from "./components/Forecast.vue";
import Controls from "./components/Controls.vue";
import Spinner from "./components/Spinner.vue";
import type { GeocodingData, OneCallWeatherData, AirPollution } from "./types/types";
import { getLocationByQuery, getLocationByCoords, getLocation, getWeatherData } from "./utilities/fetchers";
import { AxiosError } from 'axios';

const defaultLocation: GeocodingData = {
	lat: 52.3727598,
	lon: 4.8936041,
	country: "NL",
	name: "Amsterdam",
	state: "North Holland",
}

const unitsSystem = ref<'metric' | 'imperial' | undefined>();
const dateFormat = ref<'en-gb' | 'en-us' | undefined>();
const geolocation = ref<GeocodingData | null>(null);
const searchResults = ref<GeocodingData[] | null>(null);
const weatherData = ref<OneCallWeatherData | null>(null);
const pollutionData = ref<AirPollution | null>(null);
const dataError = ref<string | null>(null);
const themeLight = ref<boolean>(false);
const fetching = ref<boolean>(false);

onMounted(async () => {
	importPreferences()
});

async function importPreferences() {
	const preferLight = window.matchMedia(
		'(prefers-color-scheme: light)'
	).matches;
	if (localStorage.userThemeLight) {
		themeLight.value = JSON.parse(localStorage.userThemeLight);
	} else {
		themeLight.value = preferLight;
	}
	if (localStorage.userUnitsSystem) {
		unitsSystem.value = JSON.parse(localStorage.userUnitsSystem);
	}
	if (localStorage.userDateFormat) {
		dateFormat.value = JSON.parse(localStorage.userDateFormat);
	}
	if (localStorage.userLocation) {
		geolocation.value = JSON.parse(localStorage.userLocation)
	} else {
		getCurrentLocation();
	}
}

watch(geolocation, async (newLocation) => {
	try {
		if (!newLocation) return;
		localStorage.setItem('userLocation', JSON.stringify(newLocation));
		await updateAppData()
	} catch (error: any) {
		if (error instanceof AxiosError) {
			if (error.response?.status === 400) {
				dataError.value = 'City not found. Did you enter correct name?'
			}
		} else {
			dataError.value = 'Request error.'
		}
		if (!weatherData) {
			geolocation.value = defaultLocation;
		}
	}
});

watch(unitsSystem, (newUnitsSystem) => {
	localStorage.setItem('userUnitsSystem', JSON.stringify(newUnitsSystem));
})

watch(dateFormat, (newDateFormat) => {
	localStorage.setItem('userDateFormat', JSON.stringify(newDateFormat));
})

watch(themeLight, (newThemeLight) => {
	localStorage.setItem('userThemeLight', JSON.stringify(newThemeLight));
})

watch(searchResults, (newSearchResults) => {
	if (newSearchResults) {
		document.body.addEventListener('click', watchResultsClick)
	}
})

function changeUnitsSystem(value: 'metric' | 'imperial') {
	unitsSystem.value = value;
}

function changeDateFormat(value: 'en-gb' | 'en-us') {
	dateFormat.value = value;
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

async function updateAppData() {
	try {
		fetching.value = true;
		if (!geolocation.value) {
			getCurrentLocation()
			return
		}
		const { weather, airPollution } = await getWeatherData(geolocation.value.lat, geolocation.value.lon);
		weatherData.value = weather;
		pollutionData.value = airPollution;
		fetching.value = false
	} catch (error: any) {
		dataError.value = error || 'Error getting weather data.';
		fetching.value = false
	}
}

async function searchLocation(query: string | GeocodingData) {
	try {
		if (!query) return;
		fetching.value = true
		if (typeof query === 'string') {
			const results = await getLocationByQuery(query);
			if (!results.length) {
				throw new Error(`No results for ${query}.`)
			} else {
				searchResults.value = results;
			}
		} else if (typeof query === 'object') {
			geolocation.value = await getLocationByCoords(query.lat, query.lon);
			searchResults.value = null;
		}
		fetching.value = false
	} catch (error: any) {
		if (error instanceof AxiosError) {
			if (error.response?.status === 400) {
				dataError.value = 'City not found.'
			}
		} else {
			dataError.value = error.message || 'Error searching for city.'
		}
		searchResults.value = null;
		fetching.value = false
	}
}

async function getCurrentLocation() {
	try {
		fetching.value = true
		geolocation.value = await getLocation()
		fetching.value = false
	} catch (error: any) {
		dataError.value = error || 'Error getting location data.';
		geolocation.value = geolocation.value || defaultLocation
		fetching.value = false
	}
};
</script>

<template>
	<div class="main-container" :class="{ light: themeLight }">
		<main v-if="weatherData">
			<div class="top">
				<section class="basic">
					<Controls @changeUnitsSystem="changeUnitsSystem" @changeDateFormat="changeDateFormat"
						@searchLocation="searchLocation" @requestLocation="getCurrentLocation" @clearResults="clearSearchResults"
						@toggleTheme="toggleTheme" @updateAppData="updateAppData" :unitsSystem="unitsSystem"
						:searchResults="searchResults" :themeLight="themeLight" :dateFormat="dateFormat" :fetching="fetching" />
					<Current :weather="weatherData" :location="geolocation" :unitsSystem="unitsSystem" :dateFormat="dateFormat" />
				</section>
				<Extra :weather="weatherData" :pollution="pollutionData" :unitsSystem="unitsSystem" />
			</div>
			<Forecast :weather="weatherData" :unitsSystem="unitsSystem" :dateFormat="dateFormat" />
			<div v-if="dataError" class="error" @click="dismissError">
				<h4>{{ dataError }}</h4>
			</div>
		</main>
		<Spinner v-else />
	</div>
</template>

<style scoped lang="scss">
.main-container {
	min-height: 100vh;
	color: var(--color-text);
	background-color: var(--color-background-soft);
	transition: 0.3s ease-in-out;
}

main {
	min-height: 100vh;
	max-width: 1300px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 1rem;
	margin: 0 auto;
	padding: 1rem;
	position: relative;
}

.top {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 1rem;
}

.error {
	position: absolute;
	top: 5%;
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
	-webkit-transition: all 0.3s ease-in-out, color 0s;
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