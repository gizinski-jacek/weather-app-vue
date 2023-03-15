<script setup lang="ts">
import type { GeocodingData } from '@/types/types';
import { roundToDecimal } from '@/utilities/converters';
import { ref } from "vue";

const props = defineProps<{ metric: boolean, searchResults: GeocodingData[] | null }>();

const emit = defineEmits(["changeUnits", "searchLocation", "requestUserGeolocation", "clearResults"]);
const searchValue = ref<string>("");
const input = ref<HTMLInputElement | null>(null);
const svgBtn = ref<SVGElement | null>(null);

function clearInputAndResults() {
	searchValue.value = "";
	emit("clearResults");
}

function triggerSearch(e: KeyboardEvent | MouseEvent) {
	if (!searchValue.value) {
		if (e.target === svgBtn.value) input.value?.focus();
		return;
	} else {
		emit("searchLocation", searchValue.value.trim());
		searchValue.value = "";
	}
}
</script>

<template>
	<div class="controls">
		<div class="search">
			<input ref="input" type="text" id="search" name="search" v-model="searchValue" placeholder="Search city..."
				@keypress.enter="triggerSearch" />
			<div v-if="searchValue || searchResults" class="clear" @click="clearInputAndResults"></div>
			<div class="mag-icon">
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" @click="triggerSearch">
					<circle cx="10" cy="10" r="6" />
					<path d="M14.5 14.5L19 19" />
				</svg>
			</div>
			<div v-if="searchResults" class="search-results">
				<div v-for="(result, index) in searchResults" :key="index" class="result" @click="emit('searchLocation',
					result)">
					<div>{{ result.country }}</div>
					<div>{{ result.name }}</div>
					<div>{{ roundToDecimal(result.lat, 3) }} {{ roundToDecimal(result.lon, 3) }}</div>
				</div>
			</div>
		</div>
		<button type="button" class="geolocation" @click="emit('requestUserGeolocation')">
			<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
				<path d="M25.497 6.503l.001-.003-.004.005L3.5 15.901l11.112 1.489 1.487 11.11 9.396-21.992.005-.006z" />
			</svg>
		</button>
		<button type="button" class="units" @click="emit('changeUnits')">
			{{ metric ? "imperial" : "metric" }}
		</button>
	</div>
</template>

<style scoped lang="scss">
.controls {
	display: flex;
	justify-content: space-between;
	gap: 0.5rem;
	text-transform: capitalize;

	.units {
		min-width: 84px;
	}
}

.search {
	flex: 1;
	display: flex;
	width: fit-content;
	max-width: 320px;
	background-color: var(--color-background);
	border: 2px solid var(--color-text);
	border-radius: 4px;
	gap: 0.25rem;
	position: relative;

	input {
		width: 100%;
		background-color: transparent;
		border: none;

		&:hover {
			color: var(--color-text);
		}

		&:focus {
			color: var(--color-text-alt);
		}
	}

	.mag-icon {
		margin: auto 0;

		svg {
			display: block;
			width: 24px;
			height: 24px;
			fill: none;
			cursor: pointer;
			stroke-width: 2px;
			stroke-linecap: round;
			transition: 0.25s ease-in-out;

			circle,
			path {
				stroke: var(--color-heading);
				transition: inherit;
			}

			&:hover {

				circle,
				path {
					stroke: var(--color-text);
				}
			}

			&:active {

				circle,
				path {
					stroke: var(--color-text-alt);
				}
			}
		}
	}

	.search-results {
		position: absolute;
		top: 100%;
		left: -2px;
		right: -2px;
		z-index: 75;

		.result {
			display: grid;
			grid-template-columns: 30px 1fr min-content;
			grid-auto-flow: column;
			align-items: center;
			gap: 0.25rem;
			padding: 0.25rem 0.5rem;
			color: var(--color-heading);
			background-color: var(--color-background);
			border: 2px solid var(--color-border);
			border-bottom-width: 0;
			cursor: pointer;

			>div:nth-child(2) {
				font-weight: 600;
				margin-right: 0.25rem;
			}

			>div:last-child {
				font-size: 0.8rem;
				text-align: end;
			}

			&:last-child {
				border-bottom-width: 2px;
				border-radius: 0 0 4px 4px;
			}

			&:hover {
				color: var(--color-text);
				background-color: var(--color-background-soft);
				border: 2px solid var(--color-border-hover);

				&+div {
					border-top: 0;
				}
			}

			&:active {
				color: var(--color-text-alt);
				border: 2px solid var(--color-border-active);
			}
		}
	}
}

.geolocation {
	padding: 0;
	margin-left: auto;

	&:hover {
		border: 2px solid var(--color-text);
	}

	&:active {
		border: 2px solid var(--color-text-alt);
	}

	svg {
		display: block;
		width: 28px;
		height: 28px;
		fill: var(--color-text-alt);
	}
}

.clear {
	cursor: pointer;

	&:before,
	&:after {
		display: block;
		content: "";
		width: 20px;
		height: 2px;
		background-color: var(--color-heading);
		transform: translateY(15px) rotate(-45deg);
		transition: 0.25s ease-in-out;
	}

	&:after {
		transform: translateY(13px) rotate(45deg);
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
</style>