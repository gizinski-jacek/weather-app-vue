<script setup lang="ts">
import type { OneCallWeatherData } from "../types/types";
import { convertSpeed, convertVisibility } from "../utilities/converters";

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
		<p>Wind speed: {{ convertSpeed(metric, data.current.wind_speed) }}</p>
		<p>Wind deg: {{ data.current.wind_deg }}</p>
		<p v-if="data.current.wind_gust">
			Wind gust: {{ convertSpeed(metric, data.current.wind_gust) }}
		</p>
		<p>Cloudiness: {{ data.current.clouds }}</p>
		<p v-if="data.current.rain">Rain 1h: {{ data.current.rain["1h"] }}</p>
		<p v-if="data.current.snow">Snow 1h: {{ data.current.snow["1h"] }}</p>
	</div>
</template>
<style scoped lang="scss">
.extra-widgets {
	display: flex;
	flex-direction: row;

	>p {
		margin: 0.5rem;
	}
}

@media (min-width: 768px) {
	.extra-widgets {
		flex-direction: column;

		span {
			flex-direction: row;
		}
	}
}
</style>
