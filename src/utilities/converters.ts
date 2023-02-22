// Converters assume the parameters they receive are in metric units.
// Converters default to metric system.

// Convert temperature to Fahrenheit or return default value in Celsius.
export function convertTemp(metric: boolean = true, temp: number): string {
	return metric
		? roundToDecimal(temp) + '°C'
		: roundToDecimal(temp * 1.8 + 32) + '°F';
}

// Convert speed to imperial units or return default value in metric.
export function convertSpeed(metric: boolean = true, speed: number): string {
	return metric
		? roundToDecimal(speed) + 'm/s'
		: roundToDecimal(speed * 2.236936) + 'mi/h';
}

// Convert visibility distance to imperial units or return default value in metric.
export function convertVisibility(
	metric: boolean = true,
	visibility: number
): string {
	return metric
		? roundToDecimal(visibility / 1000) + 'km'
		: roundToDecimal(visibility / 1609.344) + 'mi';
}

// Convert precipitation to imperial units or return default value in metric.
export function convertPrecipitation(
	metric: boolean = true,
	volume: number
): string {
	return metric
		? roundToDecimal(volume) + 'mm'
		: roundToDecimal(volume / 25.4) + 'in';
}

// Convert wind speed from m/s to mph and return user friendly description.
// Based on https://www.weather.gov/pqr/wind.
export function windSpeedToDescription(speed: number): string {
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

const compass_directions: string[] = [
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

export function degreesToCompassDirection(degree: number): string {
	return compass_directions[Math.round((degree % 360) / 22.5)];
}

// Convert number to percentage value.
export function convertToPercentage(value: number): string {
	return value * 100 + '%';
}

// Round number to X (defaults to 1) decimal places as string.
export function roundToDecimal(value: number, decimal: number = 1): string {
	return (Math.round(value * 10) / 10).toFixed(decimal);
}

// Convert Ultraviolet Index to user friendly description.
// Based on https://en.wikipedia.org/wiki/Ultraviolet_index#Index_usage.
export function ultravioletIndexToDescription(uvi: number): string {
	switch (true) {
		case uvi <= 2:
			return 'low';
		case uvi <= 5:
			return 'moderate';
		case uvi <= 7:
			return 'high';
		case uvi <= 10:
			return 'very high';
		default:
			return 'extreme';
	}
}

export const airQualityIndexDescription: string[] = [
	'good',
	'fair',
	'moderate',
	'poor',
	'very poor',
];
