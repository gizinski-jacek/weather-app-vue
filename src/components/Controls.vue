<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps({
	metric: Boolean,
});
const emit = defineEmits(['changeUnits', 'searchWeather']);
const searchValue = ref('');
</script>
<template>
	<div class="controls">
		<input
			type="text"
			id="search"
			name="search"
			v-model="searchValue"
			placeholder="Search location..."
			@keypress.enter="emit('searchWeather', searchValue)"
		/>
		<button type="button" @click="emit('changeUnits')">
			Use {{ metric ? 'imperial' : 'metric' }}
		</button>
	</div>
</template>
<style scoped>
.controls {
	grid-column: 1/3;
}
</style>
