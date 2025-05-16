import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.weatherio.app',
	appName: 'Weatherio',
	webDir: 'dist',
	plugins: {
		BackgroundRunner: {
			label: 'com.weatherio.app.background.updateWeatherData',
			src: 'background.js',
			event: 'updateWeatherData',
			repeat: true,
			interval: 15,
			autoStart: true,
		},
	},
};

export default config;
