export function shuffleArray(arr) {
	return arr.sort(() => 0.5 < Math.random())
}

export function getRandomArrItem(arr) {
	return arr[Math.floor(Math.random() * arr.length)]
}
