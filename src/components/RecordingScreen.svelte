<script>
	import { MAX_DURATION } from '../routes/recorder.machine'
	import CancelIcon from './icons/CancelIcon.svelte'
	import PauseIcon from './icons/PauseIcon.svelte'

	export let state
	export let send
</script>

<div class="container" data-color="red">
	<div class="header text-md">
		<h1 class="">Now, record “{$state.context.name}”</h1>
		<p class="text-md">Up to {MAX_DURATION / 1000}s</p>
	</div>
	<button
		on:click|preventDefault={() => send('STOP_RECORDING')}
		type="button"
		class="btn play-btn"
	>
		<span class="sr-only">Stop recording</span>
		<PauseIcon />
		<div class="timer">
			<svg
				viewBox="0 0 396 396"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				style="--duration: {MAX_DURATION}ms"
			>
				<circle
					cx="198"
					cy="198"
					r="197.5"
					stroke="currentColor"
					stroke-width="1em"
				/>
			</svg>
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
</style>
