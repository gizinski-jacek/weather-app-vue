// Converters assume the parameters they receive are in metric units.

// Convert temperature to Fahrenheit or return default value in Celsius.
// Show one decimal place.
export function convertTemp(metric: boolean, temp: number): string {
	return metric
		? (Math.round(temp * 10) / 10).toFixed(1) + ' °C'
		: (Math.round((temp * 1.8 - 459.67) * 10) / 10).toFixed(1) + ' °F';
}

// Convert speed to imperial units or return default value in metric.
// Show one decimal place.
export function convertSpeed(metric: boolean, speed: number): string {
	return metric
		? (Math.round(speed * 10) / 10).toFixed(1) + ' m/s'
		: (Math.round(speed * 2.236936 * 10) / 10).toFixed(1) + ' mph';
}

// Convert visibility distance to imperial units or return default value in metric.
// Show one decimal place.
export function convertVisibility(metric: boolean, visibility: number): string {
	return metric
		? (Math.round(visibility * 10) / 10).toFixed(1) + ' m'
		: (Math.round(visibility * 1609.344 * 10) / 10).toFixed(1) + ' mi';
}
