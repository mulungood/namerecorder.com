import { writable } from 'svelte/store'

export const userStore = writable({
	user: null,
	state: 'loading',
})
