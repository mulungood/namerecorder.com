<script>
	import PauseIcon from './icons/PauseIcon.svelte'
	import PlayIcon from './icons/PlayIcon.svelte'
	import RetakeIcon from './icons/RetakeIcon.svelte'
	import SendIcon from './icons/SendIcon.svelte'

	export let state
	export let send

	let audioEl
	let playing = false

	$: if (playing) {
		audioEl?.play?.()
	} else {
		audioEl?.pause?.()
	}
</script>

<div class="container" data-color="emerald">
	<div class="header text-md">
		<h1>Check your recording</h1>
		<p class="text-md">All good? Go ahead and send it :D</p>
	</div>

	{#if $state.context.recordingBlob}
		<audio
			src={URL.createObjectURL($state.context.recordingBlob)}
			bind:this={audioEl}
			on:ended={() => (playing = false)}
		/>
	{/if}
	<button
		on:click|preventDefault={() => (playing = !playing)}
		type="button"
		class="btn play-btn"
	>
		<span class="sr-only">{playing ? 'Stop' : 'Play'} recording</span>
		{#if playing}
			<PauseIcon />
		{:else}
			<PlayIcon />
		{/if}
	</button>

	<div class="actions-footer">
		<button
			on:click|preventDefault={() => send('RETAKE_RECORDING')}
			type="button"
			data-color="red"
			class="btn"
		>
			<RetakeIcon />
			Retake
		</button>
		<button
			on:click|preventDefault={() => send('UPLOAD_RECORDING')}
			type="button"
			class="btn"
		>
			<SendIcon />
			Send
		</button>
	</div>
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
</style>
