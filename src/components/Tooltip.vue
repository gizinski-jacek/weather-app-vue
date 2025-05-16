<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
	content?: string;
}>();

const positionH = ref<'left' | 'right'>('left')
const positionV = ref<'top' | 'bottom'>('bottom')

function renderFrom(e: MouseEvent) {
	if (!e.target || typeof window === 'undefined') return
	const container = e.target as HTMLDivElement;
	const conCoords = container.getBoundingClientRect();
	const content = container.getElementsByClassName('tooltip-content')[0] as HTMLDivElement;
	const { width, height } = content.getBoundingClientRect();

	if (width + conCoords.right > window.innerWidth) {
		positionH.value = 'right';
	} else {
		positionH.value = 'left';
	}

	if (height > conCoords.top) {
		positionV.value = 'top';
	} else {
		positionV.value = 'bottom';
	}
}
</script>

<template>
	<div class="tooltip-container" @mouseenter="renderFrom">
		<div class="tooltip-content" :class="positionH, positionV">
			<div v-if="content">{{ content }}</div>
			<slot></slot>
		</div>
	</div>
</template>

<style scoped lang="scss">
.tooltip-container {
	display: block;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 50;

	.tooltip-content {
		position: absolute;
		height: 0;
		width: 0;
		overflow: hidden;
		text-transform: capitalize;
		color: var(--color-text);
		background-color: var(--color-background);
		opacity: 0;
		transition: 0;
	}

	&:hover .tooltip-content {
		height: -webkit-max-content;
		height: -moz-max-content;
		height: max-content;
		width: -webkit-max-content;
		width: -moz-max-content;
		width: max-content;
		max-width: 280px;
		text-align: center;
		padding: 0.25rem;
		border: 2px solid var(--color-border-active);
		border-radius: 4px;
		opacity: 1;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		transition: 0.15s ease-in-out;
		transition-delay: 0.4s;

		&.left {
			left: 0;
		}

		&.right {
			right: 0;
		}

		&.top {
			top: 0;
		}

		&.bottom {
			bottom: 0;
		}
	}
}
</style>