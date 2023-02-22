<script setup lang="ts">

const props = defineProps<{
	content?: string;
}>();
</script>

<template>
	<div class="tooltip-wrapper">
		<div class="tooltip-content">
			<div v-if="content">{{ content }}</div>
			<slot></slot>
		</div>
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
	z-index: 20;

	&:hover .tooltip-content {
		height: auto;
		width: auto;
		opacity: 1;
		transition: 0.15s ease-in-out;
		transition-delay: 0.25s;
		z-index: 10;
	}
}

.tooltip-content {
	position: absolute;
	bottom: 0;
	right: -50%;
	height: 0;
	width: 0;
	padding: 0.25rem 0.5rem;
	text-transform: capitalize;
	color: var(--color-text);
	background-color: var(--color-background);
	border: 2px solid var(--color-text-alt);
	border-radius: 4px;
	opacity: 0;
}
</style>