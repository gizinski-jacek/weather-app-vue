// Splits long array into smaller groups.
export function splitIntoGroups(data: any[], chunkSize: number): any[][] {
	const array = [] as any[][];
	for (let i = 0; i < data.length; i += chunkSize) {
		const chunk = data.slice(i, i + chunkSize);
		array.push(chunk);
	}
	return array;
}
