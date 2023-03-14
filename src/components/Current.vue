<script setup lang="ts">
import { convertTemp, windSpeedToDescription } from "../utilities/converters";
import type { GeocodingData, OneCallWeatherData } from "../types/types";
import Tooltip from "./Tooltip.vue";

const props = defineProps<{
	weather: OneCallWeatherData | null;
	location: GeocodingData | null;
	metric: boolean;
}>();
</script>

<template>
	<div v-if="weather && location" class="current-weather">
		<div>
			<div>
				<h4 class="date">
					{{
						new Date(weather.current.dt * 1000).toLocaleString(undefined, {
							weekday: "long",
							month: "numeric",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
						})
					}}
				</h4>
				<h2>{{ location.name }}</h2>
				<span>{{ location.country }}</span><span v-if="location.state">, {{ location.state }}</span>
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
		<div>
			<span>
				Feels like: {{ convertTemp(metric, weather.current.feels_like) }}
			</span>
			<span>{{ weather.current.weather[0].description }}</span>
			<span>{{ windSpeedToDescription(weather.current.wind_speed) }}</span>
		</div>
		<div>
			<span>Sunrise: {{ new Date(weather.current.sunrise * 1000).toLocaleString(undefined,
				{ hour: 'numeric', minute: 'numeric' }) }}</span>
			<span>Sunset: {{ new Date(weather.current.sunset * 1000).toLocaleString(undefined,
				{ hour: 'numeric', minute: 'numeric' }) }}</span>
		</div>
	</div>
</template>

<style scoped lang="scss">
.current-weather {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
	text-transform: capitalize;

	>div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 3rem;
		text-align: center;
	}

	.date {
		color: var(--color-text-alt);
		font-weight: 600;
	}
}
</style>