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

// Convert number to percentage value.
export function convertToPercentage(value: number): string {
	return roundToDecimal(value * 100, 0) + '%';
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

const pollutantConcentrationRanges: {
	[key: string]: { [key: string]: string };
} = {
	pm2_5: {
		good: '0-10',
		fair: '10-25',
		moderate: '25-50',
		poor: '50-75',
		'very poor': '75',
	},
	pm10: {
		good: '0-20',
		fair: '20-50',
		moderate: '50-100',
		poor: '100-200',
		'very poor': '200',
	},
	o3: {
		good: '0-60',
		fair: '60-100',
		moderate: '100-140',
		poor: '140-180',
		'very poor': '180',
	},
	no2: {
		good: '0-40',
		fair: '40-70',
		moderate: '70-150',
		poor: '150-200',
		'very poor': '200',
	},
	so2: {
		good: '0-20',
		fair: '20-80',
		moderate: '80-250',
		poor: '250-350',
		'very poor': '350',
	},
	co: {
		good: '0-4400',
		fair: '4400-9400',
		moderate: '9400-12400',
		poor: '12400-15400',
		'very poor': '15400',
	},
};

// Check pollutant concentration levels and return user friendly description.
// Supports: pm2.5, pm10, o3, no2, so2, co.
// Based on https://openweathermap.org/api/air-pollution.
export function pollutantConcentrationToDescription(
	pollutant: string,
	concentration: number
): string {
	const data = pollutantConcentrationRanges[pollutant.toLowerCase()];
	if (!data) return '';
	let quality: string = '';
	for (const [key, value] of Object.entries(data)) {
		const [min, max] = value.split('-').map((v) => parseInt(v));
		if (concentration >= min && concentration <= (max || 999999)) {
			quality = key;
		}
	}
	return quality;
}

const pollutantWeigh: { [key: string]: number } = {
	pm2_5: 1,
	pm10: 2,
	o3: 3,
	no2: 4,
	so2: 5,
	co: 6,
};

// Sorts pollutants that affect Air Quality Index in order of most to least harmful.
export function pollutantSort(pollutants: { [key: string]: number }): {
	[key: string]: number;
} {
	const entries: [string, number, number][] = Object.entries(pollutants).map(
		(e) => [...e, pollutantWeigh[e[0]] || 999]
	);
	const sorted = entries.sort().sort((a, b) => a[2] - b[2]);
	const object = Object.fromEntries(sorted);
	return object;
}

// Splits long array into smaller groups.
export function splitIntoGroups(data: any[], chunkSize: number): any[][] {
	const array = [] as any[][];
	for (let i = 0; i < data.length; i += chunkSize) {
		const chunk = data.slice(i, i + chunkSize);
		array.push(chunk);
	}
	return array;
}
