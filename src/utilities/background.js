import { getWeatherData, getLocation } from './fetchers';

addEventListener('updateWeatherData', async (resolve, reject, args) => {
	try {
		// Currently not working
		let location = CapacitorKV.get('userLocation');
		console.log(location);
		if (!location) {
			location = await getLocation();
		}
		const { weather, airPollution } = await getWeatherData(
			location.lat,
			location.lon
		);
		CapacitorKV.set('cachedWeather', JSON.stringify(weather));
		CapacitorKV.set('cachedAirPollution', JSON.stringify(airPollution));
		resolve();
	} catch (err) {
		console.error(`Could not update data: ${err}`);
		reject(err);
	}
});
