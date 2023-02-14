<script setup lang="ts">
import type { OneCallWeatherData } from "../types/types";
import {
	convertSpeed,
	convertVisibility,
	degreesToCompassDirection
} from "../utilities/converters";

const props = defineProps<{
	data: OneCallWeatherData | null;
	metric: boolean;
	fetching: boolean;
}>();
</script>
<template>
	<div v-if="!fetching && data" class="extra-widgets">
		<p>Pressure: {{ data.current.pressure }} hPa</p>
		<p>Visibility: {{ convertVisibility(metric, data.current.visibility) }}</p>
		<p>Wind speed: {{ convertSpeed(metric, data.current.wind_speed) }} {{
			degreesToCompassDirection(data.current.wind_deg)
		}}</p>
		<p v-if="data.current.wind_gust">
			Wind gust: {{ convertSpeed(metric, data.current.wind_gust) }}
		</p>
		<p>Humidity: {{ data.current.humidity }}%</p>
		<p>UV: {{ data.current.uvi }}</p>
		<p v-if="data.current.rain">Rain 1h: {{ data.current.rain["1h"] }}</p>
		<p v-if="data.current.snow">Snow 1h: {{ data.current.snow["1h"] }}</p>
		<p>Dew point: {{ data.current.dew_point }}°C</p>
	</div>
</template>
<style scoped lang="scss">
.extra-widgets {
	display: grid;
	grid-template-rows: auto auto;
	grid-auto-flow: column;
	grid-gap: 1rem;

	>p {
		margin: 0.5rem;
	}
}

@media (min-width: 768px) {
	.extra-widgets {
		grid-template-columns: auto auto;
		grid-auto-flow: row;

		span {
			flex-direction: row;
		}
	}
}
</style>
