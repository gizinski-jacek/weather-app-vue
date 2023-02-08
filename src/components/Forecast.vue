<script setup lang="ts">
import { ref } from "vue";
import type { OneCallWeatherData } from "../types/types";
import { convertTemp, convertSpeed } from '../utilities/converters'

const props = defineProps<{
	data: OneCallWeatherData | null;
	metric: boolean;
	fetching: boolean;
}>();

const displayedForecast = ref<"daily" | "hourly">("daily");

function changeForecast(value: "daily" | "hourly") {
	displayedForecast.value = value
}


</script>
<template>
	<div v-if="!fetching && data" class="weather-forecast">
		<div class="forecast-controls">
			<div>
				<button type="button" @click="changeForecast('daily')">Daily</button>
				<button type="button" @click="changeForecast('hourly')">Hourly</button>
			</div>

		</div>
		<div class="forecast-display">
			<div v-if="displayedForecast === 'daily'" class="forecast-daily">
				<div v-for="(d, i) in data[displayedForecast]" :key="i">
					<div>{{
						new Date(d.dt * 1000).toLocaleString(undefined,
							{
								weekday: "long",
								month: 'numeric',
								day: 'numeric',
								year: 'numeric'
							})
					}}</div>
					<img :src="`https://openweathermap.org/img/wn/${d.weather[0].icon}.png`" :alt="d.weather[0].main" />
					<div>{{ d.weather[0].main }}</div>
					<div>{{ convertTemp(metric, d.temp.day) }}</div>
				</div>
			</div>
			<div v-else-if="displayedForecast === 'hourly'" class="forecast-hourly">
				<div v-for="(d, i) in data.hourly" :key="i">
					<div>{{
						new Date(d.dt * 1000).toLocaleString(undefined,
							{
								weekday: "long",
								month: 'numeric',
								day: 'numeric',
								year: 'numeric'
							})
					}}</div>
					<img :src="`https://openweathermap.org/img/wn/${d.weather[0].icon}.png`" :alt="d.weather[0].main" />
					<div>{{ d.weather[0].main }}</div>
					<div>{{ convertTemp(metric, d.temp) }}</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped lang="scss">
.weather-forecast {
	margin-top: auto;
}

.forecast-controls {
	display: flex;
	justify-content: space-between;
}

.forecast-daily,
.forecast-hourly {
	display: flex;
	gap: 2rem;
	padding: 2rem 0;
	overflow: scroll
}
</style>
