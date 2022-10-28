<script>
	import { page } from '$app/stores'
	import PauseIcon from '../../components/icons/PauseIcon.svelte'
	import PlayIcon from '../../components/icons/PlayIcon.svelte'
	import { getObjectUrl } from '../../getObjectUrl'

	export let data

	let audioEl
	let playing = false

	$: if (playing) {
		if (audioEl?.paused) audioEl?.play?.()
	} else {
		if (!audioEl?.paused) audioEl?.pause?.()
	}

	$: name = (data.user?.name || `@${data.handle}`).replace(/\s+/g, ' ')
	$: isSuccess = $page?.url?.searchParams?.get?.('success') === 'true'
</script>

<svelte:head>
	<title>Learn how to pronounce {name}</title>
</svelte:head>

<main data-color={data.pageColor}>
	<div class="container">
		<h1>
			{#each name.split(' ') as part, i}
				{part}
				{#if i < name.split(' ').length - 1}
					<br />
				{/if}
			{/each}
		</h1>
		{#if isSuccess}
			<div class="success">
				<h2>🎉 Your recording is live!</h2>
				<p>
					Share this link with friends & colleagues:<br />
					<a href="{$page.url.origin}/@{data.handle}"
						>{$page.url.origin}/@{data.handle}</a
					>
				</p>
			</div>
		{/if}
	</div>

	<audio
		src={getObjectUrl(data.user?.user_id)}
		bind:this={audioEl}
		on:ended={() => (playing = false)}
		controls
	/>
	<button
		class="btn play-btn btn--huge"
		on:click={() => (playing = !playing)}
		tabindex={0}
	>
		<span class="sr-only">Play audio</span>
		{#if playing}
			<PauseIcon />
		{:else}
			<PlayIcon />
		{/if}
	</button>
</main>

<style>
	.btn--huge {
		color: var(--fg-color);
		font-size: 7rem;
		position: fixed;
		top: 50%;
		right: 0;
		transform: translateY(-50%) translateX(22%);
		z-index: 0;
		mix-blend-mode: color;
	}

	.btn--huge:hover :global(svg) {
		transform: scale(1.015);
		color: white;
	}

	h1 {
		font-size: calc(128 / 16 * 1rem);
		color: var(--text-color);
		word-wrap: anywhere;
		position: relative;
		z-index: 0;
		user-select: none;
		line-height: 0.85;
		display: inline-block;
	}

	.success {
		background: var(--color-tailwind-blue-50);
		border: 2px solid currentColor;
		color: var(--color-tailwind-blue-900);
		padding: 0.85em;
		border-radius: 0.35em;
		max-width: calc(600 / 16 * 1rem);
		font-size: calc(28 / 16 * 1rem);
		position: relative;
		z-index: 10;
		line-height: 1.35;
		margin-top: 1em;
	}
	.success h2 {
		margin-bottom: 0.5em;
	}
</style>
