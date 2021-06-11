export function shuffle (array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[ array[i], array[j] ] = [ array[j], array[i] ];
	}
	return array;
}

// alternative
// https://dev.to/techygeeky/top-20-javascript-tips-and-tricks-to-increase-your-speed-and-efficiency-283g
// export function shuffle (array) {
// 	return array.sort(() => {
// 		return Math.random() - 0.5;
// 	});
// }
