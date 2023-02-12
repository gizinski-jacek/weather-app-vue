<script setup lang="ts">
import { ref, watch } from "vue";
import type { OneCallWeatherData } from "../types/types";
import { convertTemp } from "../utilities/converters";
import { splitIntoGroups } from "../utilities/groupers";

const props = defineProps<{
	data: OneCallWeatherData | null;
	metric: boolean;
	fetching: boolean;
}>();

const displayedForecast = ref<"daily" | "hourly">("daily");
const pageView = ref<boolean>(true);
const currentPage = ref<number>(1);
const groupSizes = ref<number>(8);

function changeForecast(value: "daily" | "hourly") {
	displayedForecast.value = value;
}

function changeDisplay() {
	pageView.value = !pageView.value;
}

function changePage(number: number) {
	if (!props.data) return;
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

watch(pageView, () => {
	// Find a way to cleanup event listener. !!!
	const element = document.getElementById('forecast-display')
	if (!element) return
	element.addEventListener('wheel', (e) => {
		element.scrollLeft += e.deltaY;
	})
})

</script>
<template>
	<div v-if="!fetching && data" class="weather-forecast">
		<div class="forecast-controls">
			<div class="time-controls">
				<button type="button" @click="changeForecast('daily')">Daily</button>
				<button type="button" @click="changeForecast('hourly')">Hourly</button>
			</div>
			<div class="display-controls" v-if="splitIntoGroups(data[displayedForecast], groupSizes).length > 1">
				<div v-if="pageView" class="page-controls">
					<div class="arrow-prev" @click="changePage(currentPage - 1)">
						&#10094;
					</div>
					<div v-for="num in Math.ceil(data[displayedForecast].length / 8)" :key="num">
						<span class="dot" :class="{ active: currentPage === num }" @click="currentPage = num"></span>
					</div>
					<div class="arrow-next" @click="changePage(currentPage + 1)">
						&#10095;
					</div>
				</div>
				<button type="button" @click="changeDisplay">
					{{ pageView? "Pages": "Scroll" }}
				</button>
			</div>
		</div>
		<div id="forecast-display" :class="{ scroll: !pageView }">
			<div v-if="displayedForecast === 'daily'" v-for="(chunk, index1) in splitIntoGroups(
				data[displayedForecast],
				groupSizes
			)" :key="index1" class="forecast-daily"
				:class="{ active: data[displayedForecast].length > groupSizes ? currentPage - 1 === index1 : 'active' }">
				<div v-for="(d, i) in chunk" :key="i" class="day">
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
					<div>
						<img :src="`https://openweathermap.org/img/wn/${d.weather[0].icon}.png`" :alt="d.weather[0].main" />
					</div>
					<div>{{ d.weather[0].main }}</div>
					<div>{{ convertTemp(metric, d.temp.day) }}</div>
				</div>
			</div>
			<div v-else-if="displayedForecast === 'hourly'" v-for="(chunk, index2) in splitIntoGroups(
				data[displayedForecast],
				groupSizes
			)" :key="index2" class="forecast-hourly" :class="{ active: currentPage - 1 === index2 }">
				<div v-for="(d, i) in chunk" :key="i" class="hour">
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
					<div>
						<img :src="`https://openweathermap.org/img/wn/${d.weather[0].icon}.png`" :alt="d.weather[0].main" />
					</div>
					<div>{{ d.weather[0].main }}</div>
					<div>{{ convertTemp(metric, d.temp) }}</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style scoped lang="scss">
@import "../assets/base.scss";


.weather-forecast {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.forecast-controls {
	display: flex;
	justify-content: space-between;
	gap: 1rem;

	.display-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.time-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.page-controls {
		display: flex;
		align-items: center;
		gap: 0.25rem;

		.dot {
			display: block;
			padding: 0.25rem;
			margin: 0.25rem;
			margin-top: 0.5rem;
			border-radius: 50%;
			border: 2px solid var(--color-text);
			user-select: none;
			cursor: pointer;
			transition: inherit;
			transition: 0.25s ease-in-out;

			&:hover {
				background-color: var(--color-heading);
			}

			&.active {
				background-color: var(--color-text);
			}
		}

		.arrow-prev,
		.arrow-next {
			user-select: none;
			cursor: pointer;
			margin: 0 0.25rem;
			transition: 0.25s ease-in-out;

			&:hover {
				filter: brightness(75%);
			}
		}
	}
}

#forecast-display {
	display: flex;
	flex-direction: column;
	text-align: center;

	&.scroll {

		.forecast-daily,
		.forecast-hourly {
			display: flex;
		}
	}
}

.forecast-daily,
.forecast-hourly {
	display: none;
	flex-direction: column;

	&.active {
		flex: 1;
		justify-content: space-between;
		flex-wrap: nowrap;
		display: flex;
	}

	.day,
	.hour {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
		padding: 0 1rem;
		border-radius: 8px;

		&:nth-child(2n) {
			background-color: var(--color-background);
		}

		>* {
			flex: 1;
		}
	}
}

@media (min-width: 992px) {

	#forecast-display {
		flex-direction: row;

		&.scroll {
			overflow-x: scroll;
			scrollbar-width: 0;
			padding-bottom: 1rem;

			.forecast-daily,
			.forecast-hourly {
				gap: 0.5rem;
			}
		}
	}

	.forecast-daily,
	.forecast-hourly {
		flex-direction: row;

		.day,
		.hour {
			flex-direction: column;
			padding: 1rem;
		}
	}
}
</style>
