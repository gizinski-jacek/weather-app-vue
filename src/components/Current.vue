<script setup lang="ts">
import type { WeatherData } from '../types/types';

const props = defineProps<{ apiData: WeatherData | null; metric: boolean }>();
</script>
<template>
	<div class="current">
		<div v-if="apiData" class="basic">
			<p>{{ apiData.name }}</p>
			<p>{{ apiData.sys.country }}</p>
			<p>{{ apiData.main.temp }}</p>
			<p>Main: {{ apiData.weather.main }}</p>
		</div>
		<div v-if="apiData" class="more">
			<p>Data updated at: {{ apiData.dt }}</p>
			<p>Description: {{ apiData.weather.description }}</p>
			<p>Lat: {{ apiData.coord.lat }}</p>
			<p>Lon: {{ apiData.coord.lon }}</p>
		</div>
	</div>
</template>
<style scoped>
.current {
	display: flex;
	flex-direction: column;
}

.basic {
}

.more {
}
</style>
