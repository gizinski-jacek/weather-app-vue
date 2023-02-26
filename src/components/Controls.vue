<script setup lang="ts">
import type { GeocodingData } from '@/types/types';
import { ref } from "vue";

const props = defineProps<{ metric: boolean, searchResults: GeocodingData[] | null }>();

const emit = defineEmits(["changeUnits", "searchLocation", "requestUserGeolocation"]);
const searchValue = ref<string>("");
const input = ref<HTMLInputElement | null>(null);
const svgBtn = ref<SVGElement | null>(null);

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
			<svg ref="svgBtn" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" @click="triggerSearch">
				<circle cx="10" cy="10" r="6" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
				<path d="M14.5 14.5L19 19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			<div v-if="searchResults" class="search-results">
				<div v-for="(result, index) in searchResults" :key="index" class="result" @click="emit('searchLocation',
					result)">
					<div>{{ result.country }}</div>
					<div>{{ result.name }}</div>
					<div>{{ result.lat.toFixed(3) }}, {{ result.lon.toFixed(3) }}</div>
				</div>
			</div>
		</div>
		<div class="geolocation" @click="emit('requestUserGeolocation')">
			<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
				<path d="M25.497 6.503l.001-.003-.004.005L3.5 15.901l11.112 1.489 1.487 11.11 9.396-21.992.005-.006z" />
			</svg>
		</div>
		<button type="button" @click="emit('changeUnits')">
			Use {{ metric ? "imperial" : "metric" }}
		</button>
	</div>
</template>

<style scoped lang="scss">
.controls {
	display: flex;
	justify-content: space-between;
	gap: 1rem;
	text-transform: capitalize;

	button {
		min-width: 110px;
	}
}

.search {
	flex: 1;
	max-width: 300px;
	display: flex;
	width: fit-content;
	background-color: var(--color-background);
	border: 2px solid var(--color-text);
	border-radius: 4px;
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

	svg {
		width: 28px;
		height: 28px;
		fill: none;
		margin: auto 0;
		margin-right: 0;
		margin-left: auto;
		cursor: pointer;

		circle,
		path {
			stroke: var(--color-text);
		}

		&:active {

			circle,
			path {
				stroke: var(--color-text-alt);
			}
		}
	}

	.search-results {
		position: absolute;
		top: 100%;
		left: -2px;
		right: -2px;
		z-index: 20;

		.result {
			display: flex;
			gap: 1rem;
			padding: 0.25rem;
			background-color: var(--color-background);
			border: 2px solid var(--color-text);
			border-bottom-width: 0;
			cursor: pointer;

			>div:nth-child(2) {
				flex: 1;
			}

			&:last-child {
				border-bottom-width: 2px;
			}

			&:hover {
				color: var(--color-text-alt);
				border: 2px solid var(--color-text-alt);

				&+div {
					border-top: 0;
				}
			}

			&:active {
				filter: brightness(125%);
			}
		}
	}
}

.geolocation {
	width: 28px;
	height: 28px;
	margin: auto;

	svg {
		width: 28px;
		height: 28px;
		fill: var(--color-text-alt);
		cursor: pointer;
	}
}
</style>