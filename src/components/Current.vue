<script setup lang="ts">
import { convertTemp, windSpeedToDescription } from "@/utilities/converters";
import type { GeocodingData, OneCallWeatherData } from "../types/types";

const props = defineProps<{
	data: OneCallWeatherData | null;
	location: GeocodingData | null;
	metric: boolean;
	fetching: boolean;
}>();
</script>
<template>
	<div v-if="!fetching && data && location" class="current-weather">
		<div class="left">
			<p class="date">
				{{
					new Date(data.current.dt * 1000).toLocaleString(undefined, {
						weekday: "long",
						month: "numeric",
						day: "numeric",
						hour: "numeric",
						minute: "numeric",
						second: "numeric",
					})
				}}
			</p>
			<h2>{{ location.name }}, {{ location.country }}</h2>
			<p>{{ location.state }}</p>
		</div>
		<div class="center">
			<span>
				<img :src="`https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`"
					:alt="data.current.weather[0].description" />
				<h1>{{ convertTemp(metric, data.current.temp) }}</h1>
			</span>
		</div>
		<div class="right">
			<p>Feels like: {{ convertTemp(metric, data.current.feels_like) }}</p>
			<p>{{ data.current.weather[0].description }}</p>
			<p>{{ windSpeedToDescription(data.current.wind_speed) }}</p>
		</div>
	</div>
</template>
<style scoped lang="scss">
.current-weather {
	display: flex;
	justify-content: space-between;
	gap: 1rem;

	.date {
		color: var(--color-text-alt)
	}

	span {
		text-align: center;
	}

	>div {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
}

@media (min-width: 768px) {
	.current-weather {
		gap: 2rem;
	}
}
</style>
