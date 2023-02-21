<script setup lang="ts">
import { convertTemp, windSpeedToDescription } from "../utilities/converters";
import type { GeocodingData, OneCallWeatherData } from "../types/types";
import Tooltip from "./Tooltip.vue";

const props = defineProps<{
	weather: OneCallWeatherData | null;
	location: GeocodingData | null;
	metric: boolean;
	fetching: boolean;
}>();
</script>

<template>
	<div v-if="!fetching && weather && location" class="current-weather">
		<div class="left">
			<div>
				<span class="date">
					{{
						new Date(weather.current.dt * 1000).toLocaleString(undefined, {
							weekday: "long",
							month: "numeric",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
							second: "numeric",
						})
					}}
				</span>
				<h2>{{ location.name }}</h2>
				<span>{{ location.country }}, {{ location.state }}</span>
			</div>
			<div>
				<div>
					<div>
						<Tooltip :content="weather.current.weather[0].description" />
						<img :src="`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`"
							:alt="weather.current.weather[0].description" />
					</div>
					<h1>{{ convertTemp(metric, weather.current.temp) }}</h1>
				</div>
			</div>
		</div>
		<div class="right">
			<span>
				Feels like: {{ convertTemp(metric, weather.current.feels_like) }}
			</span>
			<span>{{ weather.current.weather[0].description }}</span>
			<span>{{ windSpeedToDescription(weather.current.wind_speed) }}</span>
		</div>
	</div>
</template>

<style scoped lang="scss">
.current-weather {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 1rem;

	.date {
		color: var(--color-text-alt);
	}

	.left,
	.right {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		gap: 1rem;
		text-align: center;
	}

	.right {
		justify-content: space-between;
	}
}
</style>
