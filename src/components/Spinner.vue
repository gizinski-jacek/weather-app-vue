<script setup lang="ts">
</script>

<template>
	<div class="container">
		<div class="spinner"></div>
	</div>
</template>

<style scoped lang="scss">
.container {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.spinner {
	border: 16px solid var(--color-background);
	border-top: 16px solid var(--color-text-alt);
	border-radius: 50%;
	width: 160px;
	height: 160px;
	animation: spin 1.5s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>