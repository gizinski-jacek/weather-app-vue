<script setup lang="ts">
import type { WeatherData } from '../types/types';

const props = defineProps<{ apiData: WeatherData | null; metric: boolean }>();
</script>
<template>
	<div class="forecast">
		<div v-if="apiData">
			sunrise:{{ apiData.sys.sunrise }} sunset:{{ apiData.sys.sunset }}
		</div>
	</div>
</template>
<style scoped>
.forecast {
	grid-column: 1/3;
}
</style>
