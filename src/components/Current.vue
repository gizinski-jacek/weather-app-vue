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
			<div>
				<span class="date">
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
				</span>
				<h2>{{ location.name }}</h2>
				<span>{{ location.country }}, {{ location.state }}</span>
			</div>
			<div>
				<span>
					<img :src="`https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`"
						:alt="data.current.weather[0].description" />
					<h1>{{ convertTemp(metric, data.current.temp) }}</h1>
				</span>
			</div>
		</div>
		<div class="right">
			<span>
				Feels like: {{ convertTemp(metric, data.current.feels_like) }}
			</span>
			<span>{{ data.current.weather[0].description }}</span>
			<span>{{ windSpeedToDescription(data.current.wind_speed) }}</span>
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
