<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ metric: boolean }>();

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

	&:hover input {
		color: var(--color-text);
	}

	input {
		width: 100%;
		background-color: transparent;
		border: none;

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
		display: flex;
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