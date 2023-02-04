<script setup lang="ts">
import type { WeatherData } from '../types/types';
import { convertTemp, convertSpeed } from '../utilities/converters';

const props = defineProps<{ apiData: WeatherData | null; metric: boolean }>();
</script>
<template>
	<div class="extra">
		<div v-if="apiData">
			<p>Feels like: {{ convertTemp(metric, apiData.main.feels_like) }}</p>
			<p>Temp min: {{ convertTemp(metric, apiData.main.temp_min) }}</p>
			<p>Temp max: {{ convertTemp(metric, apiData.main.temp_max) }}</p>
			<p>Pressure: {{ apiData.main.pressure }}</p>
			<p>Pressure sea level: {{ apiData.main.sea_level }}</p>
			<p>Pressure ground level: {{ apiData.main.grnd_level }}</p>
			<p>Visibility: {{ apiData.visibility }}</p>
			<p>Wind speed: {{ convertSpeed(metric, apiData.wind.speed) }}</p>
			<p>Wind deg: {{ apiData.wind.deg }}</p>
			<p v-if="apiData.wind.gust">
				Wind gust: {{ convertSpeed(metric, apiData.wind.gust) }}
			</p>
			<p>Cloudiness: {{ apiData.clouds.all }}</p>
			<p v-if="apiData.rain">Rain 1h: {{ apiData.rain['1h'] }}</p>
			<p v-if="apiData.rain">Rain 3h: {{ apiData.rain['3h'] }}</p>
			<p v-if="apiData.snow">Snow 1h: {{ apiData.snow['1h'] }}</p>
			<p v-if="apiData.snow">Snow 3h: {{ apiData.snow['3h'] }}</p>
		</div>
	</div>
</template>
<style scoped>
.extra {
}
</style>
