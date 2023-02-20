<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
	content: string;
}>();

const tooltipVisible = ref<boolean>(false);

function showTooltip() {
	tooltipVisible.value = true;
};

function hideTooltip() {
	tooltipVisible.value = false;
}
</script>

<template>
	<div class="tooltip-wrapper" @mouseenter="showTooltip" @mouseleave="hideTooltip">
		<div class="tooltip-content" :class="{ show: tooltipVisible }">{{ content }}</div>
	</div>
</template>

<style scoped lang="scss">
.tooltip-wrapper {
	display: block;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 10;
}

.tooltip-content {
	position: absolute;
	bottom: -50%;
	right: 0;
	padding: 0.25rem;
	text-transform: capitalize;
	inline-size: min-content;
	color: var(--color-text);
	background-color: var(--color-background);
	border: 1px solid var(--color-text-alt);
	border-radius: 4px;
	opacity: 0;
}

.tooltip-content.show {
	opacity: 1;
	transition: 0.25s ease-in-out;
	transition-delay: 0.25s;
}
</style>