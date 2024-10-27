export function formatMS_HHMMSS(num: number) {
	const results = [86400000, 3600000, 60000, 1000, 1].reduce((p: number[], c: number) => {
		const res = ~~(num / c);
		num -= res * c;
		p.push(res);
		return p;
	}, []);

	return results
		.map((v, i) =>
			i <= 1 && v === 0
				? undefined
				: [i === 4 ? "." : "", v < 10 ? `0${v}` : v, [" Days, ", ":", ":", "", ""][i]].join(""),
		)
		.filter(Boolean)
		.slice(0, -1)
		.join("");
}

export const delay = async (ms: number) => new Promise(resolve => setTimeout(() => resolve(true), ms));
