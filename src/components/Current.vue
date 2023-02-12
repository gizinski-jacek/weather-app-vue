<script setup lang="ts">
import { convertTemp } from "@/utilities/converters";
import type { GeocodingData, OneCallWeatherData } from "../types/types";
import Controls from './Controls.vue'

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
			<h2>{{ location.name }}, {{ location.country }}</h2>
			<p>{{ location.state }}</p>
			<p>
				{{
					new Date(data.current.dt * 1000).toLocaleString(undefined, {
						weekday: "long",
						month: "numeric",
						day: "numeric",
						year: "numeric",
						hour: "numeric",
						minute: "numeric",
						second: "numeric",
					})
				}}
			</p>
		</div>
		<div class="right">
			<span>
				<img :src="`https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`"
					:alt="data.current.weather[0].description" />
				<h1>{{ convertTemp(metric, data.current.temp) }}</h1>
			</span>
			<p>Feels like: {{ convertTemp(metric, data.current.feels_like) }}</p>
			<p>{{ data.current.weather[0].description }}</p>
		</div>
	</div>
</template>
<style scoped lang="scss">
.current-weather {
	display: flex;
	gap: 1rem;
	margin: 0.5rem 0;

	span {
		display: flex;
		align-items: center;
	}

	>div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

	}
}
</style>
