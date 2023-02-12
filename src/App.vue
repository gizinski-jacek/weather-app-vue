<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Current from "./components/Current.vue";
import Extra from "./components/Extra.vue";
import Forecast from "./components/Forecast.vue";
import Controls from "./components/Controls.vue";
import type { GeocodingData, OneCallWeatherData } from "./types/types";
import { fetchGeolocation, fetchWeatherOneCall } from "./utilities/fetchers";

const metric = ref<boolean>(true);
const location = ref<GeocodingData | null>({
	lat: 52.3727598,
	lon: 4.8936041,
	country: "NL",
	name: "Amsterdam",
	state: "North Holland",
});
const apiData = ref<OneCallWeatherData | null>(null);
const fetching = ref<boolean>(true);

onMounted(async () => {
	try {
		if (!location.value) return;
		fetching.value = true;
		getGeolocation();
		const { lat, lon } = location.value;
		apiData.value = await fetchWeatherOneCall(lat, lon);
		fetching.value = false;
	} catch (error) {
		console.error(error);
		fetching.value = false;
	}
});

watch(location, async () => {
	if (!location.value) return;
	fetching.value = true;
	const { lat, lon } = location.value;
	apiData.value = await fetchWeatherOneCall(lat, lon);
	fetching.value = false;
});

async function changeLocation(query: string) {
	try {
		if (!query) return;
		location.value = await fetchGeolocation(query);
	} catch (error) {
		console.error(error);
	}
}

function changeUnits() {
	metric.value = !metric.value;
}

function getGeolocation(): GeolocationPosition | null {
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
</script>
<template>
	<main v-if="apiData">
		<div class="top">
			<div>
				<Controls @changeUnits="changeUnits" @changeLocation="changeLocation" :metric="metric" />
				<Current :data="apiData" :location="location" :metric="metric" :fetching="fetching" />
			</div>
			<Extra :data="apiData" :metric="metric" :fetching="fetching" />
		</div>
		<Forecast :data="apiData" :metric="metric" :fetching="fetching" />
	</main>
</template>

<style scoped lang="scss">
main {
	min-height: 100vh;
	width: 100%;
	padding: 1rem;
	text-transform: capitalize;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 1rem;

	.top {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}
}
</style>
