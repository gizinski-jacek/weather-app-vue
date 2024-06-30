<script setup lang="ts">
import { convertTemp, windSpeedToDescription } from "../utilities/converters";
import type { GeocodingData, OneCallWeatherData } from "../types/types";
import { ref } from 'vue';

const props = defineProps<{
	weather: OneCallWeatherData | null;
	location: GeocodingData | null;
	metric: boolean;
}>();
const showAlert = ref<boolean>(false);

function toggleAlert() {
	showAlert.value = !showAlert.value
}
</script>

<template>
	<div v-if="weather && location">
		<div v-if="weather.alerts" class="alert" :class="{ show: showAlert }">
			<svg @click="toggleAlert" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
				<g>
					<path
						d="M479.548,265.753c-2.408-6.276-2.408-13.224,0-19.522l19.468-51.108c4.6-12.065,0.162-25.666-10.63-32.714   l-45.797-29.904c-5.635-3.682-9.719-9.317-11.471-15.801l-14.296-52.799c-3.366-12.443-14.96-20.865-27.828-20.224l-54.636,2.732   c-6.715,0.324-13.324-1.814-18.564-6.036L273.2,6.073c-10.035-8.097-24.361-8.097-34.404,0l-42.594,34.304   c-5.241,4.222-11.848,6.36-18.572,6.036l-54.629-2.732c-12.868-0.64-24.462,7.781-27.827,20.224l-14.288,52.799   c-1.76,6.484-5.843,12.119-11.478,15.801L23.61,162.408c-10.791,7.048-15.222,20.664-10.629,32.714l19.476,51.116   c2.401,6.291,2.401,13.238,0,19.521l-19.476,51.116c-4.593,12.042-0.162,25.666,10.629,32.714l45.798,29.912   c5.635,3.666,9.718,9.286,11.478,15.785l14.288,52.799c3.366,12.451,14.96,20.865,27.827,20.224l54.629-2.717   c6.724-0.348,13.331,1.806,18.572,6.021l42.594,34.319c10.043,8.09,24.369,8.09,34.396,0l42.602-34.319   c5.234-4.214,11.849-6.368,18.564-6.021l54.636,2.717c12.868,0.641,24.462-7.773,27.828-20.224l14.296-52.799   c1.752-6.499,5.836-12.119,11.471-15.785l45.797-29.912c10.792-7.048,15.23-20.672,10.622-32.714L479.548,265.753z    M288.778,369.127c0,10.451-8.476,18.943-18.927,18.943h-27.704c-10.452,0-18.935-8.492-18.935-18.943v-28.916   c0-10.452,8.483-18.943,18.935-18.943h27.704c10.451,0,18.927,8.491,18.927,18.943V369.127z M288.778,268.948   c0,10.452-8.476,18.928-18.927,18.928h-27.704c-10.452,0-18.935-8.476-18.935-18.928V142.879c0-10.467,8.483-18.943,18.935-18.943   h27.704c10.451,0,18.927,8.476,18.927,18.943V268.948z" />
				</g>
			</svg>
			<div class="alert-content">
				<div v-for="(alert, index) in weather.alerts" :key="index">
					<div>{{ alert.sender_name }}.</div>
					<div>{{ alert.event }}.</div>
					<div>{{ alert.description }}</div>
					<div>Start: {{
		new Date(alert.start * 1000).toLocaleString(undefined, {
			weekday: "long",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		})
	}}</div>
					<div>End: {{
			new Date(alert.end * 1000).toLocaleString(undefined, {
				weekday: "long",
				month: "numeric",
				day: "numeric",
				hour: "numeric",
				minute: "numeric",
			})
		}}</div>
				</div>
			</div>
		</div>
		<div class="current-weather">
			<div>
				<div>
					<h4 class="date">
						{{
		new Date(weather.current.dt * 1000).toLocaleString(undefined, {
			weekday: "long",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		})
	}}
					</h4>
					<h2>{{ location.name }}</h2>
					<span>{{ location.country }}</span><span v-if="location.state">, {{ location.state }}</span>
				</div>
				<div>
					<img :src="`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@4x.png`"
						:alt="weather.current.weather[0].description" />
					<h1>{{ convertTemp(metric, weather.current.temp) }}</h1>
				</div>
			</div>
			<div>
				<span>
					Feels like: <span class="temperature">{{ convertTemp(metric, weather.current.feels_like) }}</span>
				</span>
				<span>{{ weather.current.weather[0].description }}</span>
				<span>{{ windSpeedToDescription(weather.current.wind_speed) }}</span>
			</div>
			<div>
				<span>Sunrise: {{ new Date(weather.current.sunrise * 1000).toLocaleString(undefined,
		{ hour: 'numeric', minute: 'numeric' }) }}</span>
				<span>Sunset: {{ new Date(weather.current.sunset * 1000).toLocaleString(undefined,
					{ hour: 'numeric', minute: 'numeric' }) }}</span>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.alert {
	display: flex;
	gap: 1rem;
	margin: 1rem;
	z-index: 50;
	position: absolute;
	top: 0;
	left: 0%;

	svg {
		width: 40px;
		height: 40px;
		cursor: pointer;

		path {
			fill: var(--color-text-alt);
			transition: 0.35s ease-in-out;
		}

		&:hover path {
			filter: brightness(110%);
		}

		&:active path {
			filter: brightness(120%);
		}
	}

	.alert-content {
		height: 0;
		flex: 1;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;

		>div {
			display: block;
			width: 100%;
			color: var(--color-background);
			background-color: var(--color-border-active);
			border: 0 solid var(--color-red);
			border-radius: 8px;
			overflow: hidden;
			margin: 0.25rem;
			padding: 0 0.5rem;
			transform: scale(0);
			transform-origin: 0 0;
		}
	}

	&.show .alert-content {
		height: fit-content;
		width: 85vw;

		>div {
			padding: 0.25rem 0.5rem;
			border-width: 3px;
			transform: scale(1);
		}
	}
}

.current-weather {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
	text-transform: capitalize;

	>div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 3rem;
		text-align: center;
	}

	.date {
		color: var(--color-text-alt);
		transition: 0.35s ease-in-out;
	}

	img {
		width: 120px;
	}

	.temperature {
		display: inline-block;
		min-width: 48px;
	}
}
</style>
