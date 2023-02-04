// Convert temperature in Kelvin units to metric or imperial.
export function convertTemp(metric: boolean, temp: number): string {
	return metric
		? Math.round((temp - 273.15) * 10) / 10 + '°C'
		: Math.round((temp * 1.8 - 459.67) * 10) / 10 + '°F';
}

// Convert speed to imperial units or return received speed.
// (Assuming API default is metric).
export function convertSpeed(metric: boolean, speed: number): string {
	return metric
		? Math.round(speed * 10) / 10 + ' m/s'
		: Math.round(speed * 2.236936 * 10) / 10 + ' mph';
}
