<script setup lang="ts">
import type { GeocodingData } from '@/types/types';
import { roundToDecimal } from '@/utilities/converters';
import { onMounted, onUnmounted, ref } from "vue";
import Settings from './Settings.vue';

const props = defineProps<{
	unitsSystem: 'metric' | 'imperial' | undefined,
	dateFormat: 'en-gb' | 'en-us' | undefined,
	searchResults: GeocodingData[] | null,
	themeLight: boolean,
	fetching: boolean
}>();

const emit = defineEmits(["changeUnitsSystem", "changeDateFormat", "searchLocation", "requestLocation", "clearResults", "toggleTheme", "updateAppData"]);
const searchValue = ref<string>("");
const input = ref<HTMLInputElement | null>(null);
const svgBtn = ref<SVGElement | null>(null);
const settings = ref<boolean>(false);

onMounted(() => {
	const input = document.getElementById('search');
	if (!input) return;
	input.addEventListener('focus', watchFocus);
	input.addEventListener('blur', watchFocus);
})

onUnmounted(() => {
	const input = document.getElementById('search');
	if (!input) return;
	input.removeEventListener('focus', watchFocus);
	input.removeEventListener('blur', watchFocus);
})

function watchFocus(e: any) {
	const div = document.getElementById('search-box') as HTMLDivElement;
	if (e.target === document.activeElement) {
		div.style.borderColor = "var(--color-text-alt)";
	} else {
		div.style.removeProperty('border-color')
	}
}

function clearInputAndResults() {
	searchValue.value = "";
	emit("clearResults");
}

function triggerSearch(e: KeyboardEvent | MouseEvent) {
	if (!searchValue.value) {
		if (e.target === svgBtn.value) input.value?.focus();
	} else {
		emit("searchLocation", searchValue.value.trim());
	}
}

function openSettings() {
	settings.value = true
}

function closeSettings() {
	settings.value = false
}

function changeUnitsSystem(unitsSystem: 'metric' | 'imperial') {
	emit('changeUnitsSystem', unitsSystem)
}

function changeDateFormat(dateFormat: 'en-gb' | 'en-us') {
	emit('changeDateFormat', dateFormat)
}
</script>

<template>
	<div class="controls">
		<div id="search-box">
			<input ref="input" type="text" id="search" name="search" v-model="searchValue" placeholder="Search city..."
				@keypress.enter="triggerSearch" />
			<div v-if="searchValue || searchResults" class="clear" @click="clearInputAndResults"></div>
			<div class="mag-icon">
				<svg ref="svgBtn" viewBox="0 0 24 24" stroke-width="2px" stroke-linecap="round"
					xmlns="http://www.w3.org/2000/svg" @click="triggerSearch">
					<circle cx="10" cy="10" r="6" />
					<path d="M14.5 14.5L19 19" />
				</svg>
			</div>
			<div v-if="searchResults" class="search-results">
				<div v-for="(result, index) in searchResults" :key="index" class="result" @click="emit('searchLocation',
					result)">
					<h4>{{ result.country }}</h4>
					<div>
						<h4>{{ result.name }}</h4>
						<h5>{{ result.state }}</h5>
					</div>
					<div>
						<h5>{{ roundToDecimal(result.lat, 3) }}</h5>
						<h5>{{ roundToDecimal(result.lon, 3) }}</h5>
					</div>
				</div>
			</div>
		</div>
		<button type="button" class="update-data" :class="{ fetching: fetching }" @click="emit('updateAppData')">
			<svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
				<g stroke-width="0"></g>
				<g stroke-linecap="round" stroke-linejoin="round"></g>
				<g>
					<path
						d="M27.1 14.313V5.396L24.158 8.34c-2.33-2.325-5.033-3.503-8.11-3.503C9.902 4.837 4.901 9.847 4.899 16c.001 6.152 5.003 11.158 11.15 11.16 4.276 0 9.369-2.227 10.836-8.478l.028-.122h-3.23l-.022.068c-1.078 3.242-4.138 5.421-7.613 5.421a8 8 0 0 1-5.691-2.359A7.993 7.993 0 0 1 8 16.001c0-4.438 3.611-8.049 8.05-8.049 2.069 0 3.638.58 5.924 2.573l-3.792 3.789H27.1z">
					</path>
				</g>
			</svg>
		</button>
		<button type="button" class="geolocation" @click="emit('requestLocation')">
			<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
				<path d="M25.497 6.503l.001-.003-.004.005L3.5 15.901l11.112 1.489 1.487 11.11 9.396-21.992.005-.006z" />
			</svg>
		</button>
		<button type="button" class="settings" :class="{ open: settings }" @click="openSettings">
			<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g stroke-width="0"></g>
				<g stroke-linecap="round" stroke-linejoin="round"></g>
				<g>
					<path fill-rule="evenodd" clip-rule="evenodd"
						d="M3.59938 6.22413C3.362 4.82033 4.68002 3.64638 6.07306 4.02084L7.12777 4.30435C7.96485 4.52937 8.85305 4.19092 9.31887 3.46943L10.3298 1.90368C11.1077 0.698775 12.8923 0.698773 13.6702 1.90368L14.6811 3.46943C15.1469 4.19092 16.0351 4.52937 16.8722 4.30435L17.9269 4.02084C19.32 3.64638 20.638 4.82033 20.4006 6.22413L20.1405 7.76265C20.0068 8.55335 20.3773 9.3442 21.0747 9.75663L22.0388 10.3268C23.3204 11.0847 23.3204 12.9153 22.0388 13.6732L21.0747 14.2434C20.3773 14.6558 20.0068 15.4467 20.1405 16.2374L20.4006 17.7759C20.638 19.1797 19.32 20.3536 17.9269 19.9792L16.8722 19.6957C16.0351 19.4706 15.1469 19.8091 14.6811 20.5306L13.6702 22.0963C12.8923 23.3012 11.1077 23.3012 10.3298 22.0963L9.31887 20.5306C8.85305 19.8091 7.96485 19.4706 7.12777 19.6957L6.07306 19.9792C4.68002 20.3536 3.362 19.1797 3.59938 17.7759L3.85954 16.2374C3.99324 15.4467 3.62271 14.6558 2.92531 14.2434L1.96116 13.6732C0.679612 12.9153 0.679614 11.0847 1.96116 10.3268L2.92531 9.75663C3.62271 9.3442 3.99324 8.55335 3.85954 7.76265L3.59938 6.22413ZM9.03042 6.14621H6.06085V9.0731L3.09127 12L6.06085 14.9269V17.8538H9.03042L12 20.7807L14.9696 17.8538H17.9392V14.9269L20.9087 12L17.9392 9.0731V6.14621H14.9696L12 3.21931L9.03042 6.14621Z"
						fill="#0F0F0F"></path>
					<path
						d="M16.4515 12C16.4515 14.4247 14.4572 16.3903 11.9971 16.3903C9.53706 16.3903 7.54277 14.4247 7.54277 12C7.54277 9.57528 9.53706 7.60965 11.9971 7.60965C14.4572 7.60965 16.4515 9.57528 16.4515 12ZM9.51963 12C9.51963 13.3486 10.6288 14.4419 11.9971 14.4419C13.3654 14.4419 14.4746 13.3486 14.4746 12C14.4746 10.6514 13.3654 9.5581 11.9971 9.5581C10.6288 9.5581 9.51963 10.6514 9.51963 12Z"
						fill="#0F0F0F"></path>
				</g>
			</svg>
		</button>
		<button type="button" class="theme" :class="{ light: themeLight }" @click="emit('toggleTheme')">
			<svg class="sun" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect width="24" height="24" />
				<path fill-rule="evenodd" clip-rule="evenodd"
					d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12Z"
					fill="#323232" />
				<path fill-rule="evenodd" clip-rule="evenodd"
					d="M12 2C12.5523 2 13 2.44772 13 3V5C13 5.55228 12.5523 6 12 6C11.4477 6 11 5.55228 11 5V3C11 2.44772 11.4477 2 12 2Z"
					fill="#323232" />
				<path fill-rule="evenodd" clip-rule="evenodd"
					d="M19.7071 4.29289C20.0976 4.68342 20.0976 5.31658 19.7071 5.70711L17.7071 7.70711C17.3166 8.09763 16.6834 8.09763 16.2929 7.70711C15.9024 7.31658 15.9024 6.68342 16.2929 6.29289L18.2929 4.29289C18.6834 3.90237 19.3166 3.90237 19.7071 4.29289Z"
					fill="#323232" />
				<path fill-rule="evenodd" clip-rule="evenodd"
					d="M18 12C18 11.4477 18.4477 11 19 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H19C18.4477 13 18 12.5523 18 12Z"
					fill="#323232" />
				<path fill-rule="evenodd" clip-rule="evenodd"
					d="M16.2929 16.2929C16.6834 15.9024 17.3166 15.9024 17.7071 16.2929L19.7071 18.2929C20.0976 18.6834 20.0976 19.3166 19.7071 19.7071C19.3166 20.0976 18.6834 20.0976 18.2929 19.7071L16.2929 17.7071C15.9024 17.3166 15.9024 16.6834 16.2929 16.2929Z"
					fill="#323232" />
				<path fill-rule="evenodd" clip-rule="evenodd"
					d="M12 18C12.5523 18 13 18.4477 13 19V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V19C11 18.4477 11.4477 18 12 18Z"
					fill="#323232" />
				<path fill-rule="evenodd" clip-rule="evenodd"
					d="M7.70711 16.2929C8.09763 16.6834 8.09763 17.3166 7.70711 17.7071L5.70711 19.7071C5.31658 20.0976 4.68342 20.0976 4.29289 19.7071C3.90237 19.3166 3.90237 18.6834 4.29289 18.2929L6.29289 16.2929C6.68342 15.9024 7.31658 15.9024 7.70711 16.2929Z"
					fill="#323232" />
				<path fill-rule="evenodd" clip-rule="evenodd"
					d="M2 12C2 11.4477 2.44772 11 3 11H5C5.55228 11 6 11.4477 6 12C6 12.5523 5.55228 13 5 13H3C2.44772 13 2 12.5523 2 12Z"
					fill="#323232" />
				<path fill-rule="evenodd" clip-rule="evenodd"
					d="M4.29289 4.29289C4.68342 3.90237 5.31658 3.90237 5.70711 4.29289L7.70711 6.29289C8.09763 6.68342 8.09763 7.31658 7.70711 7.70711C7.31658 8.09763 6.68342 8.09763 6.29289 7.70711L4.29289 5.70711C3.90237 5.31658 3.90237 4.68342 4.29289 4.29289Z"
					fill="#323232" />
			</svg>
			<svg class="moon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect width="24" height="24" />
				<path fill-rule="evenodd" clip-rule="evenodd"
					d="M8.23129 2.24048C9.24338 1.78695 10.1202 2.81145 9.80357 3.70098C8.72924 6.71928 9.38932 10.1474 11.6193 12.3765C13.8606 14.617 17.3114 15.2755 20.3395 14.1819C21.2206 13.8637 22.2173 14.7319 21.7817 15.7199C21.7688 15.7491 21.7558 15.7782 21.7427 15.8074C20.9674 17.5266 19.7272 19.1434 18.1227 20.2274C16.4125 21.3828 14.3957 22.0001 12.3316 22.0001H12.3306C9.93035 21.9975 7.6057 21.1603 5.75517 19.6321C3.90463 18.1039 2.64345 15.9797 2.18793 13.6237C1.73241 11.2677 2.11094 8.82672 3.2586 6.71917C4.34658 4.72121 6.17608 3.16858 8.20153 2.25386L8.23129 2.24048Z" />
			</svg>
		</button>
		<Settings v-if="settings" @closeSettings="closeSettings" @changeUnitsSystem="changeUnitsSystem"
			@changeDateFormat="changeDateFormat" :unitsSystem="unitsSystem" :dateFormat="dateFormat">
		</Settings>
	</div>
</template>

<style scoped lang="scss">
.controls {
	display: flex;
	justify-content: space-between;
	gap: 0.5rem;
	text-transform: capitalize;
	height: 32px;
}

#search-box {
	flex: 1;
	display: flex;
	width: -webkit-fit-content;
	width: -moz-fit-content;
	width: fit-content;
	max-width: 320px;
	background-color: var(--color-background);
	border: 2px solid var(--color-border);
	border-radius: 4px;
	gap: 0.25rem;
	position: relative;
	margin-right: auto;
	transition: 0.3s ease-in-out;

	input {
		width: 100%;
		background-color: transparent;
		border: none;
		transition: 0.3s ease-in-out;
		font-weight: 700;

		&:hover {
			color: var(--color-text);
		}

		&:focus {
			color: var(--color-text-alt);
		}
	}

	.mag-icon {
		margin: auto 0;
		transition: 0.3s ease-in-out;

		svg {
			width: 24px;
			height: 24px;
			fill: none;
			cursor: pointer;

			circle,
			path {
				stroke: var(--color-heading);
				transition: 0.3s ease-in-out;
			}

			&:hover {

				circle,
				path {
					stroke: var(--color-text);
				}
			}

			&:active {

				circle,
				path {
					stroke: var(--color-text-alt);
				}
			}
		}
	}

	.clear {
		display: block;
		width: 20px;
		height: 20px;
		margin: auto;
		cursor: pointer;

		&:before,
		&:after {
			display: block;
			content: '';
			width: 16px;
			height: 2px;
			background-color: var(--color-border);
			transform: translateY(9px) rotate(-45deg);
			transition: 0.3s ease-in-out;
		}

		&:after {
			transform: translateY(7px) rotate(45deg);
		}

		&:hover:before,
		&:hover:after {
			background-color: var(--color-border-hover);
		}

		&:active:before,
		&:active:after {
			background-color: var(--color-border-active);
		}
	}

	.search-results {
		position: absolute;
		top: 30px;
		left: -2px;
		right: -2px;
		z-index: 75;

		.result {
			display: grid;
			grid-template-columns: 30px 1fr -webkit-min-content;
			grid-template-columns: 30px 1fr min-content;
			grid-auto-flow: column;
			align-items: center;
			gap: 0.25rem;
			padding: 0.25rem 0.5rem;
			color: var(--color-heading);
			background-color: var(--color-background);
			border: 2px solid var(--color-border);
			border-bottom-width: 0;
			cursor: pointer;
			line-height: 1.25rem;

			>div {
				&:last-child {
					margin-left: auto;
					text-align: end;
				}
			}

			&:first-child {
				border-radius: 4px 4px 0 0;
			}

			&:last-child {
				border-bottom-width: 2px;
				border-radius: 0 0 4px 4px;
			}

			&:hover {
				color: var(--color-text);
				background-color: var(--color-background-soft);
				border: 2px solid var(--color-border-hover);

				&:not(:last-child) {
					border-bottom-width: 0;
				}

				&+div {
					border-top-color: var(--color-border-hover);
				}
			}

			&:active {
				color: var(--color-text-alt);
				border: 2px solid var(--color-border-active);

				&:not(:last-child) {
					border-bottom-width: 0;
				}

				&+div {
					border-top-color: var(--color-border-active);
				}
			}
		}
	}
}

.update-data {
	padding: 0;
	width: 32px;
	height: 32px;

	svg {
		width: 28px;
		height: 28px;
		margin: auto;
		fill: var(--color-text-alt);
	}

	&.fetching {
		svg {
			-webkit-animation: spin 500ms infinite linear;
			animation: spin 500ms infinite linear;
		}
	}

	@-webkit-keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
}

.geolocation {
	padding: 0;
	width: 32px;
	height: 32px;

	svg {
		width: 28px;
		height: 28px;
		margin: auto;
		fill: var(--color-text-alt);
	}
}

.settings {
	padding: 0px;
	width: 32px;
	height: 32px;

	svg {
		width: 24px;
		height: 24px;
		margin: auto;

		path {
			fill: var(--color-text-alt);
			transition: 0.3s ease-in-out;
		}
	}
}

.theme {
	padding: 0;
	width: 32px;
	height: 32px;
	display: grid;

	svg {
		width: 24px;
		height: 24px;
		margin: auto;
		grid-column: 1;
		grid-row: 1;

		path {
			fill: var(--color-text-alt);
			transition: 0.3s ease-in-out;
		}
	}

	.sun {
		opacity: 0;
		transform: rotate(180deg);
	}

	.moon {
		opacity: 1;
		transform: rotate(0);
	}

	&.light {
		.sun {
			opacity: 1;
			transform: rotate(0);
		}

		.moon {
			opacity: 0;
			transform: rotate(180deg);
		}
	}
}
</style>
