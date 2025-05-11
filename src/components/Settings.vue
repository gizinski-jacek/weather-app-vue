<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';


const props = defineProps<{
	unitsSystem: 'metric' | 'imperial',
	dateFormat: 'en-gb' | 'en-us',
}>();

const emit = defineEmits(["closeSettings", "changeUnitsSystem", "changeDateFormat"]);

onMounted(() => {
	document.body.style.overflow = 'hidden'
});

onUnmounted(() => {
	document.body.style.overflow = ''
})

function changeUnitsSystem(unitsSystem: 'metric' | 'imperial') {
	emit('changeUnitsSystem', unitsSystem)
}

function changeDateFormat(dateFormat: 'en-gb' | 'en-us') {
	emit('changeDateFormat', dateFormat)
}
</script>

<template>
	<div class="modal-container">
		<div class="modal-background" @click="emit('closeSettings')"></div>
		<div class="settings-container">
			<button type="button" class="close" @click="emit('closeSettings')">
				Close
			</button>
			<span>Change units system</span>
			<div>
				<button type="button" :class="{ active: unitsSystem === 'metric' }" @click="changeUnitsSystem('metric')">
					metric
				</button>
				<button type="button" :class="{ active: unitsSystem === 'imperial' }" @click="changeUnitsSystem('imperial')">
					imperial
				</button>
			</div>
			<span>Change date format</span>
			<div>
				<button type="button" :class="{ active: dateFormat === 'en-gb' }" @click="changeDateFormat('en-gb')">
					DD/MM
				</button>
				<button type="button" :class="{ active: dateFormat === 'en-us' }" @click=" changeDateFormat('en-us')">
					MM/DD
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.modal-container {
	min-width: var(--min-app-width);
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 500;

	.modal-background {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: var(--color-background-trans);
	}
}

.settings-container {
	padding: 1rem 3rem;
	gap: 0.5rem;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	background-color: var(--color-background-soft);
	border: 2px solid var(--color-border-hover);

	span {
		text-align: center;
	}

	>div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;

		button {
			width: 120px;
		}

		button.active {
			color: var(--color-text-alt);
			border-color: var(--color-border-active);
		}
	}

	.close {
		margin: auto;
	}
}

@media (min-width: 640px) {
	.settings-container {
		>div {
			flex-direction: row;
		}
	}
}
</style>