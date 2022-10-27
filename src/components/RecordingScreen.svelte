<script>
	import { MAX_DURATION } from '../routes/recorder.machine'

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
		<svg
			viewBox="0 0 114 114"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M16.9336 0.527832C12.5824 0.527832 8.40939 2.25634 5.33262 5.33311C2.25586 8.40988 0.527344 12.5829 0.527344 16.9341V96.6216C0.527344 105.678 7.87734 113.028 16.9336 113.028H30.9961C35.3473 113.028 39.5203 111.299 42.5971 108.223C45.6738 105.146 47.4023 100.973 47.4023 96.6216V16.9341C47.4023 12.5829 45.6738 8.40988 42.5971 5.33311C39.5203 2.25634 35.3473 0.527832 30.9961 0.527832H16.9336ZM82.5586 0.527832C78.2074 0.527832 74.0344 2.25634 70.9576 5.33311C67.8809 8.40988 66.1523 12.5829 66.1523 16.9341V96.6216C66.1523 105.678 73.5023 113.028 82.5586 113.028H96.6211C100.972 113.028 105.145 111.299 108.222 108.223C111.299 105.146 113.027 100.973 113.027 96.6216V16.9341C113.027 12.5829 111.299 8.40988 108.222 5.33311C105.145 2.25634 100.972 0.527832 96.6211 0.527832H82.5586Z"
			/>
		</svg>
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
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M0.794315 1.10789L0.940315 0.939886C1.19429 0.68585 1.531 0.531394 1.88922 0.504601C2.24744 0.477808 2.60337 0.580458 2.89232 0.793886L3.06032 0.939886L12.0003 9.87789L20.9403 0.937886C21.0788 0.794687 21.2443 0.680493 21.4274 0.601967C21.6104 0.523441 21.8073 0.482156 22.0064 0.480519C22.2056 0.478883 22.4031 0.516929 22.5874 0.592437C22.7717 0.667946 22.9391 0.779404 23.0799 0.920309C23.2207 1.06121 23.332 1.22874 23.4073 1.41312C23.4827 1.5975 23.5205 1.79504 23.5187 1.99421C23.5169 2.19337 23.4754 2.39018 23.3967 2.57315C23.318 2.75612 23.2036 2.92158 23.0603 3.05989L14.1223 11.9999L23.0623 20.9399C23.3161 21.1941 23.4701 21.531 23.4966 21.8892C23.523 22.2474 23.42 22.6032 23.2063 22.8919L23.0603 23.0599C22.8063 23.3139 22.4696 23.4684 22.1114 23.4952C21.7532 23.522 21.3973 23.4193 21.1083 23.2059L20.9403 23.0599L12.0003 14.1219L3.06032 23.0619C2.77728 23.335 2.39831 23.486 2.00501 23.4824C1.61172 23.4788 1.23557 23.3209 0.957589 23.0426C0.679607 22.7644 0.522031 22.3881 0.5188 21.9948C0.515569 21.6015 0.666942 21.2227 0.940315 20.9399L9.87832 11.9999L0.938315 3.05989C0.684579 2.80566 0.530492 2.46882 0.504067 2.11061C0.477642 1.7524 0.580632 1.3966 0.794315 1.10789L0.940315 0.939886L0.794315 1.10789V1.10789Z"
			/>
		</svg>

		Cancel
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
