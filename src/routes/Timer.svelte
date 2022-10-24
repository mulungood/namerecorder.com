<script>
	import { onDestroy } from 'svelte'
	import { MAX_DURATION } from './recorder.machine'

	const TIMER_INTERVAL = 100
	/**
	 * In milliseconds
	 */
	let time = 0

	const timer = setInterval(() => (time += TIMER_INTERVAL), TIMER_INTERVAL)

	onDestroy(() => {
		clearInterval(timer)
	})
</script>

<div>
	{(time / 1000).toFixed(2)} / {MAX_DURATION / 1000}
</div>
