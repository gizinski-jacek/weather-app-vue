<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
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
const smallScreen = ref<boolean>(false);

onMounted(() => {
	if (window.innerWidth < 540) smallScreen.value = true;
	window.addEventListener("resize", watchResize);
});

onUnmounted(() => {
	window.removeEventListener("resize", watchResize);
});

function watchResize() {
	if (window.innerWidth < 540) {
		smallScreen.value = true;
	} else {
		smallScreen.value = false;
	}
}

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
	const element = document.getElementById("forecast-display");
	if (!element) return;
	element.addEventListener("wheel", (e: WheelEvent) => {
		element.scrollLeft += e.deltaY;
	});
});
</script>
<template>
	<div v-if="!fetching && data" class="weather-forecast">
		<div class="forecast-controls">
			<div class="time-controls">
				<button type="button" @click="changeForecast('daily')" :class="{ active: displayedForecast === 'daily' }">
					Daily
				</button>
				<button type="button" @click="changeForecast('hourly')" :class="{ active: displayedForecast === 'hourly' }">
					Hourly
				</button>
			</div>
			<div class="display-controls" v-if="splitIntoGroups(data[displayedForecast], groupSizes).length > 1">
				<div v-if="pageView" class="page-controls">
					<div class="arrow-prev" @click="changePage(currentPage - 1)"></div>
					<div v-for="num in Math.ceil(data[displayedForecast].length / 8)" :key="num">
						<span class="dot" :class="{ active: currentPage === num }" @click="currentPage = num"></span>
					</div>
					<div class="arrow-next" @click="changePage(currentPage + 1)"></div>
				</div>
				<button type="button" @click="changeDisplay">
					{{ pageView? "Pages": "Scroll" }}
				</button>
			</div>
		</div>
		<div id="forecast-display" :class="{ scroll: !pageView }">
			<div v-if="displayedForecast === 'daily'" v-for="(chunk, indexH) in splitIntoGroups(
				data[displayedForecast],
				groupSizes
			)" :key="indexH" class="forecast-daily" :class="{
	active:
		data[displayedForecast].length > groupSizes
			? currentPage - 1 === indexH
			: 'active',
}">
				<div v-for="(d, i) in chunk" :key="i" class="day">
					<div class="date">
						{{
							new Date(d.dt * 1000).toLocaleString(undefined, {
								weekday: smallScreen ? "short" : "long",
								month: "numeric",
								day: "numeric",
							})
						}}
					</div>
					<div>
						<img :src="`https://openweathermap.org/img/wn/${d.weather[0].icon}.png`" :alt="d.weather[0].main" />
					</div>
					<div>{{ convertTemp(metric, d.temp.day) }}</div>
					<div class="description">{{ d.weather[0].description }}</div>
				</div>
			</div>
			<div v-else-if="displayedForecast === 'hourly'" v-for="(chunk, indexD) in splitIntoGroups(
				data[displayedForecast],
				groupSizes
			)" :key="indexD" class="forecast-hourly" :class="{ active: currentPage - 1 === indexD }">
				<div v-for="(h, i) in chunk" :key="i" class="hour">
					<div class="date">
						{{
							new Date(h.dt * 1000).toLocaleString(undefined, {
								weekday: smallScreen ? "short" : "long",
								month: "numeric",
								day: "numeric",
								hour: "numeric",
								minute: "numeric",
							})
						}}
					</div>
					<div>
						<img :src="`https://openweathermap.org/img/wn/${h.weather[0].icon}.png`" :alt="h.weather[0].main" />
					</div>
					<div>{{ convertTemp(metric, h.temp) }}</div>
					<div class="description">{{ h.weather[0].description }}</div>
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
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;

	.time-controls {
		button:not(.active) {
			color: var(--color-heading);
			background-color: transparent;
			border: 2px solid;
			border-color: var(--color-heading) transparent;
			border-radius: 0;

			&:hover {
				border-color: var(--color-heading);
				border-radius: 4px;
			}
		}
	}

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
			width: 14px;
			height: 14px;
			margin: 0 0.25rem;
			border-radius: 50%;
			border: 2px solid var(--color-text);
			user-select: none;
			cursor: pointer;
			transition: 0.25s ease-in-out;

			&:hover {
				background-color: var(--color-border-hover);
			}

			&.active {
				background-color: var(--color-text);
			}
		}

		.arrow-prev,
		.arrow-next {

			&:before,
			&:after {
				display: block;
				content: "";
				width: 12px;
				height: 4px;
				background-color: var(--color-heading);
				transform: translateY(-1px) rotate(-45deg);
				cursor: pointer;
				margin: 0 0.25rem;
				transition: 0.25s ease-in-out;
			}

			&:after {
				transform: translateY(1px) rotate(45deg);
			}

			&:hover:before,
			&:hover:after {
				background-color: var(--color-text);
			}
		}

		.arrow-next {
			transform: scaleX(-1);
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
	min-height: 280px;

	&.active {
		justify-content: space-between;
		flex-wrap: nowrap;
		display: flex;
	}

	.day,
	.hour {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 0 1rem;
		gap: 1rem;
		border-radius: 8px;

		&:nth-child(2n) {
			background-color: var(--color-background);
		}

		.date,
		.description {
			flex: 1;
		}
	}
}

@media (min-width: 540px) {
	.forecast-controls {
		flex-direction: row;
	}
}

@media (min-width: 940px) {
	#forecast-display {
		flex-direction: row;
		max-width: 1200px;
		padding-bottom: 1rem;

		&.scroll {
			overflow-x: scroll;

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
			flex: 1 1 0px;
		}
	}
}
</style>
