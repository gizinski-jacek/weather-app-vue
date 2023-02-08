<script setup lang="ts">
import { convertTemp } from "@/utilities/converters";
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
		<div class="basic">
			<p>{{ location.name }}, {{ location.country }}, {{ location.state }}</p>
			<p>{{ data.current.weather[0].main }}</p>
			<p>
				{{
					new Date(data.current.dt * 1000).toLocaleString(undefined,
						{
							weekday: "long",
							month: 'numeric',
							day: 'numeric',
							year: 'numeric'
						})
				}}
			</p>
			<img :src="`https://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`"
				:alt="data.current.weather[0].main" />
			<p>{{ convertTemp(metric, data.current.temp) }}</p>
		</div>
		<div class="more">
			<p>
				{{
					new Date(data.current.dt * 1000).toLocaleString(undefined,
						{
							weekday: "long",
							month: 'numeric',
							day: 'numeric',
							year: 'numeric'
						})
				}}
			</p>
			<p> {{ data.current.weather[0].description }}</p>
			<p>Lat: {{ data.lat }}</p>
			<p>Lon: {{ data.lon }}</p>
		</div>
	</div>
</template>
<style scoped lang="scss">
.current-weather {
	display: flex;
	gap: 2rem;
}

.basic {}

.more {}
</style>
