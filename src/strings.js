/**
 * Makes a string URL-friendly.
 * Removes special characters, spaces, upper-cased letters.
 */
export function slugify(str) {
	const acceptedCharacters = [
		'a-z', // lower-case letters
		'0-9', // numbers
		' ', // spaces
		'-', // hyphens
	]

	return str
		.toString()
		.normalize('NFD') // split an accented letter in the base letter and the acent
		.replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
		.toLowerCase()
		.replace(new RegExp(`[^${acceptedCharacters.join('')}]`, 'g'), '')
		.replace(/\s+/g, '-')
		.trim()
}
