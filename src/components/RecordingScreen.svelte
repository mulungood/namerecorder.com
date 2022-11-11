<script>
	import { onMount } from 'svelte'
	import { COUNTDOWN_DURATION, MAX_DURATION } from '../routes/recorder.machine'
	import CancelIcon from './icons/CancelIcon.svelte'
	import PauseIcon from './icons/PauseIcon.svelte'

	export let state
	export let send

	const COUNTDOWN_STEP = 1000

	$: recording = $state.matches('recording.recording')
	let countdownTime = COUNTDOWN_DURATION

	onMount(() => {
		const interval = setInterval(() => {
			if (countdownTime > 0) {
				countdownTime -= COUNTDOWN_STEP
			}
		}, COUNTDOWN_STEP)
		return () => {
			clearInterval(interval)
		}
	})
</script>

<div class="container" data-color="red">
	<div class="header text-md">
		<h1 class="">
			{recording ? `Now, record “${$state.context.name}”` : 'Get ready...'}
		</h1>
		<p class="text-md">
			{recording
				? `Up to ${MAX_DURATION / 1000}s`
				: `You'll record "${$state.context.name}" in up to ${
						MAX_DURATION / 1000
				  }s`}
		</p>
	</div>
	<button
		on:click|preventDefault={() => send('STOP_RECORDING')}
		type="button"
		class="btn play-btn"
		disabled={!recording}
	>
		{#if recording}
			<span class="sr-only">Stop recording</span>
			<PauseIcon />
		{:else}
			<div class="countdown" aria-live="polite">
				<span class="sr-only">Time to start recording:</span>
				{countdownTime / 1000}
			</div>
		{/if}
		<div class="timer">
			{#key recording}
				<svg
					viewBox="0 0 396 396"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					style="--duration: {recording ? MAX_DURATION : COUNTDOWN_DURATION}ms"
				>
					<circle
						cx="198"
						cy="198"
						r="197.5"
						stroke="currentColor"
						stroke-width="0.55em"
					/>
				</svg>
			{/key}
		</div>
	</button>
	<button
		on:click|preventDefault={() => send('CANCEL_RECORDING')}
		type="button"
		data-color="neutral"
		class="btn"
	>
		<CancelIcon /> Cancel
	</button>
</div>

<style>
	.container {
		gap: 0.5rem;
		text-align: center;
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	.header {
		color: var(--color-tailwind-slate-600);
	}

	.btn {
		margin-top: 2em;
	}

	.play-btn {
		font-size: 2rem;
		position: relative;
	}

	@keyframes drawCircle {
		100% {
			stroke-dashoffset: 0;
		}
	}
	.timer svg {
		stroke-dasharray: 1250;
		stroke-dashoffset: 1250;
		animation: var(--duration) drawCircle forwards linear;
		overflow: visible;
	}
	.timer {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		transform-origin: center;
		transform: scale(1.025) rotate(-90deg);
		color: var(--color-tailwind-blue-200);
		z-index: -1;
	}

	.countdown {
		font-size: 3em;
		font-weight: bold;
		color: var(--text-color);
		opacity: 0.8;
	}
</style>
