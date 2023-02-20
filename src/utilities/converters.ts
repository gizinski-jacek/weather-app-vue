// Converters assume the parameters they receive are in metric units.

// Convert temperature to Fahrenheit or return default value in Celsius.
// Show one decimal place.
export function convertTemp(metric: boolean, temp: number): string {
	return metric
		? (Math.round(temp * 10) / 10).toFixed(1) + '°C'
		: (Math.round((temp * 1.8 + 32) * 10) / 10).toFixed(1) + '°F';
}

// Convert speed to imperial units or return default value in metric.
// Show one decimal place.
export function convertSpeed(metric: boolean, speed: number): string {
	return metric
		? (Math.round(speed * 10) / 10).toFixed(1) + 'm/s'
		: (Math.round(speed * 2.236936 * 10) / 10).toFixed(1) + 'mph';
}

// Convert visibility distance to imperial units or return default value in metric.
// Show one decimal place.
export function convertVisibility(metric: boolean, visibility: number): string {
	return metric
		? (Math.round((visibility / 1000) * 10) / 10).toFixed(1) + 'km'
		: (Math.round((visibility / 1609.344) * 10) / 10).toFixed(1) + 'mi';
}

// Convert precipitation to imperial units or return default value in metric.
// Show one decimal place.
export function convertPrecipitation(metric: boolean, volume: number): string {
	return metric
		? (Math.round(volume * 10) / 10).toFixed(1) + 'mm'
		: (Math.round((volume / 25.4) * 10) / 10).toFixed(1) + 'in';
}

// Convert wind speed from m/s to mph and return user friendly description.
// Based on https://www.weather.gov/pqr/wind.
export function windSpeedToDescription(speed: number) {
	const mph = Math.round(speed * 2.2369362921);
	switch (true) {
		case mph < 1:
			return 'Calm';
		case mph <= 3:
			return 'Light Air';
		case mph <= 7:
			return 'Light Breeze';
		case mph <= 12:
			return 'Gentle Breeze';
		case mph <= 18:
			return 'Moderate Breeze';
		case mph <= 24:
			return 'Fresh Breeze';
		case mph <= 31:
			return 'Strong Breeze';
		case mph <= 38:
			return 'Near Gale';
		case mph <= 46:
			return 'Gale';
		case mph <= 54:
			return 'Strong Gale';
		case mph <= 63:
			return 'Storm';
		case mph <= 75:
			return 'Violent Storm';
		default:
			return 'Hurricane';
	}
}

const compass_directions = [
	'N',
	'NNE',
	'NE',
	'ENE',
	'E',
	'ESE',
	'SE',
	'SSE',
	'S',
	'SSW',
	'SW',
	'WSW',
	'W',
	'WNW',
	'NW',
	'NNW',
	'N',
];

export function degreesToCompassDirection(degree: number) {
	return compass_directions[Math.round((degree % 360) / 22.5)];
}
