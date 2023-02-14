<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ metric: boolean }>();

const emit = defineEmits(["changeUnits", "changeLocation"]);
const searchValue = ref("");
</script>
<template>
	<div class="controls">
		<input type="text" id="search" name="search" v-model="searchValue" placeholder="Search city..."
			@keypress.enter="emit('changeLocation', searchValue)" />
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

	input {
		flex: 1;
		max-width: 300px;
	}

	button {
		min-width: 110px;
	}
}
</style>
