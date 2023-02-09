<script setup lang="ts">
import { ref } from "vue";
import type { OneCallWeatherData, HourlyForecast, DailyForecast } from "../types/types";
import { convertTemp, convertSpeed } from "../utilities/converters";
import { splitIntoGroups } from '../utilities/groupers';

const props = defineProps<{
	data: OneCallWeatherData | null;
	metric: boolean;
	fetching: boolean;
}>();

const displayedForecast = ref<"daily" | "hourly">("daily");
const displayPages = ref<boolean>(true);
const currentPage = ref<number>(1);
const groupSizes = ref<number>(8)

function changeForecast(value: "daily" | "hourly") {
	displayedForecast.value = value;
}

function changeDisplay() {
	displayPages.value = !displayPages.value;
}

function changePage(number: number) {
	if (!props.data) return
	if (number > Math.ceil(props.data[displayedForecast.value].length / 8)) {
		currentPage.value = 1;
	} else if (number < 1) {
		currentPage.value = Math.ceil(
			props.data[displayedForecast.value].length / 8
		);
	} else {
		currentPage.value = number;
	}
}
</script>
<template>
	<div v-if="!fetching && data" class="weather-forecast">
		<div class="forecast-controls">
			<div class="time-controls">
				<button type="button" @click="changeForecast('daily')">Daily</button>
				<button type="button" @click="changeForecast('hourly')">Hourly</button>
			</div>
			<div class="display-controls" v-if="splitIntoGroups(data[displayedForecast], groupSizes).length > 1">
				<div v-if="displayPages" class="page-controls">
					<div class="arrow-prev" @click="changePage(currentPage - 1)">
						prev
					</div>
					<div v-for="num in Math.ceil(data[displayedForecast].length / 8)" :key="num">
						<span class="dot" :class="{ 'active': currentPage === num }" @click="currentPage = num"></span>
					</div>
					<div class="arrow-next" @click="changePage(currentPage + 1)">
						next
					</div>
				</div>
				<button type="button" @click="changeDisplay">
					{{ displayPages? "Pages": "Scroll" }}
				</button>
			</div>
		</div>
		<div class="forecast-display" :class="{ 'scroll': !displayPages }">
			<div v-if="displayedForecast === 'daily'"
				v-for="(chunk, index1) in (splitIntoGroups(data[displayedForecast], groupSizes) as DailyForecast[][])"
				:key="index1" class="forecast-daily" :class="{ 'active': currentPage - 1 === index1 }">
				<div v-for="(d, i) in chunk" :key="i">
					<div>
						{{
							new Date(d.dt * 1000).toLocaleString(undefined, {
								month: "numeric",
								day: "numeric",
								year: "numeric",
							})
						}}
					</div>
					<div>
						{{
							new Date(d.dt * 1000).toLocaleString(undefined, {
								weekday: "long",
							})
						}}
					</div>
					<img :src="`https://openweathermap.org/img/wn/${d.weather[0].icon}.png`" :alt="d.weather[0].main" />
					<div>{{ d.weather[0].main }}</div>
					<div>{{ convertTemp(metric, d.temp.day) }}</div>
				</div>
			</div>
			<div v-else-if="displayedForecast === 'hourly'"
				v-for="(chunk, index2) in (splitIntoGroups(data[displayedForecast], groupSizes) as HourlyForecast[][])"
				:key="index2" class="forecast-hourly" :class="{ 'active': currentPage - 1 === index2 }">
				<div v-for="(d, i) in chunk" :key="i">
					<div>
						{{
							new Date(d.dt * 1000).toLocaleString(undefined, {
								month: "numeric",
								day: "numeric",
								year: "numeric",
							})
						}}
					</div>
					<div>
						{{
							new Date(d.dt * 1000).toLocaleString(undefined, {
								weekday: "long",
							})
						}}
					</div>
					<img :src="`https://openweathermap.org/img/wn/${d.weather[0].icon}.png`" :alt="d.weather[0].main" />
					<div>{{ d.weather[0].main }}</div>
					<div>{{ convertTemp(metric, d.temp) }}</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped lang="scss">
@import '../assets/base.scss';

.weather-forecast {
	display: flex;
	flex-direction: column;
	gap: 2rem;
}

.forecast-controls {
	display: flex;
	justify-content: space-between;

	.display-controls {
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	.time-controls {
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	.page-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;

		.dot {
			display: block;
			padding: 0.25rem;
			margin: 0.25rem;
			border-radius: 50%;
			border: 2px solid var(--vt-c-text-dark-2);
			user-select: none;
			cursor: pointer;

			&.active {
				background-color: var(--vt-c-text-dark-1);
			}
		}

		.arrow-prev,
		.arrow-next {
			padding: 2px;
			user-select: none;
			cursor: pointer;
		}
	}
}

.forecast-display {
	display: flex;
	padding-bottom: 1rem;
	gap: 2rem;

	&.scroll {
		overflow-x: scroll;

		.forecast-daily,
		.forecast-hourly {
			display: flex;
		}
	}
}

.forecast-daily,
.forecast-hourly {
	display: none;
	gap: 2rem;

	&.active {
		flex: 1;
		justify-content: space-between;
		flex-wrap: nowrap;
		display: flex;
	}
}
</style>
