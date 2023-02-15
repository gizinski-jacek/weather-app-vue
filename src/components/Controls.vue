<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ metric: boolean }>();

const emit = defineEmits(["changeUnits", "changeLocation"]);
const searchValue = ref<string>("");
const input = ref<HTMLInputElement | null>(null)
const svgBtn = ref<SVGElement | null>(null)

function triggerSearch(e: KeyboardEvent | MouseEvent) {
	if (!searchValue.value) {
		if (e.target === svgBtn.value) input.value?.focus()
		return
	} else {
		emit('changeLocation', searchValue.value)
	}
}
</script>
<template>
	<div class="controls">
		<div class="search">
			<input ref="input" type="text" id="search" name="search" v-model="searchValue" placeholder="Search city..."
				@keypress.enter="triggerSearch" />
			<svg ref="svgBtn" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" @click="triggerSearch">
				<circle cx="10" cy="10" r="6" stroke="#000000" stroke-width="2" stroke-linecap="round"
					stroke-linejoin="round" />
				<path d="M14.5 14.5L19 19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</div>
		<button type="button" @click="emit('changeUnits')">
			Use {{ metric? "imperial": "metric" }}
		</button>
	</div>
</template>
<style scoped lang="scss">
.controls {
	display: flex;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 1rem;

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
	border-radius: 8px;

	&:hover input {
		color: var(--color-text);
	}

	input {
		width: 100%;
		background-color: transparent;
		border: none;
		font-weight: 600;

		&:focus {
			color: var(--color-text);
		}
	}

	svg {
		width: 1.75rem;
		height: 1.75rem;
		fill: none;
		margin: auto 0;
		margin-right: 0;
		margin-left: auto;
		cursor: pointer;

		circle,
		path {
			stroke: var(--color-text);
		}
	}
}
</style>
