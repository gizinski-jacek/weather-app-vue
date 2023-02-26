<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import type { OneCallWeatherData } from "../types/types";
import { convertTemp, convertToPercentage, splitIntoGroups } from "../utilities/converters";
import ScrollToTopBtn from "../components/ScrollToTopBtn.vue";

const props = defineProps<{
	weather: OneCallWeatherData | null;
	metric: boolean;
}>();

const displayedForecast = ref<"daily" | "hourly">("daily");
const pageView = ref<boolean>(true);
const currentPage = ref<number>(1);
const groupSize = ref<number>(8);
const smallScreen = ref<boolean>(false);

onMounted(() => {
	if (typeof window === 'undefined') return;
	if (window.innerWidth < 540) smallScreen.value = true;
	window.addEventListener("resize", watchResize);
});

onUnmounted(() => {
	window.removeEventListener("resize", watchResize);
	document.getElementById("forecast-display")?.removeEventListener("wheel", scrollHorizontally)
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
	if (!props.weather) return;
	if (
		number >
		Math.ceil(props.weather[displayedForecast.value].length / groupSize.value)
	) {
		currentPage.value = 1;
	} else if (number < 1) {
		currentPage.value = Math.ceil(
			props.weather[displayedForecast.value].length / groupSize.value
		);
	} else {
		currentPage.value = number;
	}
}

function scrollHorizontally(e: WheelEvent) {
	const element = document.getElementById("forecast-display");
	if (!element) return;
	if (window.innerWidth >= 940) e.preventDefault()
	element.scrollLeft += e.deltaY;
}

function scrollToEnd(e: MouseEvent) {
	const element = document.getElementById("forecast-display");
	if (!element) return;
	element.scrollTo({
		left: element.scrollWidth,
		behavior: 'smooth',
	});
}

function scrollToStart(e: MouseEvent) {
	const element = document.getElementById("forecast-display");
	if (!element) return;
	element.scrollTo({
		left: 0,
		behavior: 'smooth',
	});
}

watch(pageView, () => {
	const element = document.getElementById("forecast-display");
	if (!element) return;
	if (pageView.value) {
		element.removeEventListener("wheel", scrollHorizontally);
	} else {
		element.addEventListener("wheel", scrollHorizontally)
	}
});
</script>

<template>
	<div v-if="weather" class="weather-forecast">
		<div class="forecast-controls">
			<div class="time-controls">
				<button type="button" @click="changeForecast('daily')" :class="{ active: displayedForecast === 'daily' }">
					Daily
				</button>
				<button type="button" @click="changeForecast('hourly')" :class="{ active: displayedForecast === 'hourly' }">
					Hourly
				</button>
			</div>
			<div class="display-controls" v-if="splitIntoGroups(weather[displayedForecast], groupSize).length > 1">
				<div v-if="pageView" class="page-controls">
					<div class="arrow-prev" @click="changePage(currentPage - 1)"></div>
					<div v-for="num in Math.ceil(weather[displayedForecast].length / groupSize)" :key="num">
						<span class="dot" :class="{ active: currentPage === num }" @click="currentPage = num"></span>
					</div>
					<div class="arrow-next" @click="changePage(currentPage + 1)"></div>
				</div>
				<div v-else="pageView" class="scroll-controls">
					<button type="button" class="scroll-to-start" @click="scrollToStart">Start</button>
					<button type="button" class="scroll-to-end" @click="scrollToEnd">End</button>
				</div>
				<button type="button" @click="changeDisplay">
					{{ pageView ? "Pages" : "Scroll" }}
				</button>
			</div>
		</div>
		<div id="forecast-display" :class="{ scroll: !pageView }">
			<div v-if="displayedForecast === 'daily'" v-for="(chunk, indexH) in splitIntoGroups(
				weather[displayedForecast],
				groupSize
			)" :key="indexH" class="forecast-daily" :class="{
	active:
		weather[displayedForecast].length > groupSize
			? currentPage - 1 === indexH
			: 'active',
}">
				<div v-for="(d, i) in chunk" :key="i" class="day">
					<div>
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
					<div>{{ convertToPercentage(d.pop) }}</div>
					<div>{{ d.weather[0].description }}</div>
				</div>
			</div>
			<div v-else-if="displayedForecast === 'hourly'" v-for="(chunk, indexD) in splitIntoGroups(
				weather[displayedForecast],
				groupSize
			)" :key="indexD" class="forecast-hourly" :class="{ active: currentPage - 1 === indexD }">
				<div v-for="(h, i) in chunk" :key="i" class="hour">
					<div>
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
					<div>{{ convertToPercentage(h.pop) }}</div>
					<div>{{ h.weather[0].description }}</div>
				</div>
			</div>
		</div>
		<ScrollToTopBtn />
	</div>
</template>

<style scoped lang="scss">
@import "../assets/base.scss";

.weather-forecast {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	text-transform: capitalize;

	button.active {
		color: var(--color-text-alt);
		border-color: var(--color-text);
	}
}

.forecast-controls {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;

	.time-controls {
		button:not(.active) {
			background-color: transparent;
			border-color: var(--color-heading) transparent;
			border-radius: 0;

			&:hover {
				background-color: var(--color-background);
				border-color: var(--color-text);
				border-radius: 4px;
			}

			&:active {
				border-color: var(--color-text-alt);
			}
		}
	}

	.display-controls {
		display: flex;
		align-items: center;
		gap: 2rem;
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

			&:active {
				background-color: var(--color-text-alt);
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

			&:active:before,
			&:active:after {
				background-color: var(--color-text-alt);
			}
		}

		.arrow-next {
			transform: scaleX(-1);
		}
	}

	.scroll-controls {
		display: none;
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
			flex-direction: column;
		}
	}
}

.forecast-daily,
.forecast-hourly {
	display: none;
	flex: 1;
	min-height: 280px;

	&.active {
		display: flex;
		flex-direction: column;
	}

	.day,
	.hour {
		display: grid;
		grid-template-columns: 1fr 50px 50px 50px 1fr;
		grid-auto-flow: column;
		align-items: center;
		padding: 0 1rem;
		gap: 0.5rem;
		border-radius: 8px;

		&:nth-child(2n) {
			background-color: var(--color-background);
		}
	}
}

@media (min-width: 640px) {
	.forecast-controls {
		flex-direction: row;
		flex-wrap: nowrap;
	}
}

@media (min-width: 940px) {
	.forecast-controls {
		.scroll-controls {
			display: flex;
			align-items: center;
			gap: 0.5rem;
		}
	}

	#forecast-display {
		flex-direction: row;
		padding-bottom: 1.5rem;

		&.scroll {
			overflow-x: scroll;

			.forecast-daily,
			.forecast-hourly {
				display: grid;
				grid-template-columns: minmax(0, 1fr);
				grid-auto-columns: 1fr;
				grid-auto-flow: column;
				min-width: 100%;
			}
		}
	}

	.forecast-daily,
	.forecast-hourly {
		grid-auto-flow: column;

		&.active {
			display: grid;
			grid-template-columns: minmax(0, 1fr);
			grid-auto-columns: 1fr;
			grid-auto-flow: column;
		}

		.day,
		.hour {
			display: grid;
			grid-template-columns: unset;
			grid-template-rows: 1fr 50px 50px 50px 1fr;
			grid-auto-flow: column;
			justify-items: center;
			align-items: start;
			padding: 1rem;
			gap: 0;
		}
	}
}
</style>