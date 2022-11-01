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
	$: largestNameLength = name
		.split(' ')
		.sort((a, b) => b.length - a.length)[0].length
</script>

<svelte:head>
	<title>Learn how to pronounce {name}</title>
	<link rel="preload" href={getObjectUrl(data.user?.user_id)} />
</svelte:head>

<main data-color={data.pageColor}>
	<div class="container">
		<h1 data-small={largestNameLength > 12}>
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
		position: fixed;
		z-index: 0;
		mix-blend-mode: darken;
		bottom: 0;
		right: 50%;
		transform: translateY(20%) translateX(50%);
		font-size: 10vh;
	}

	.btn--huge:hover :global(svg) {
		transform: scale(1.015);
		color: white;
	}

	@keyframes pulseBg {
		100% {
			transform: scale(var(--final-scale));
		}
	}

	.btn--huge::before,
	.btn--huge::after {
		content: '';
		display: block;
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: -1;
		left: 0;
		top: 0;
		transform-origin: center;
		background: radial-gradient(transparent, var(--ring-color));
		border-radius: 50%;
		animation: pulseBg infinite alternate 3s ease;
	}

	.btn--huge::before {
		--final-scale: 1.07;
		--ring-color: var(--fg-color);
	}

	.btn--huge::after {
		--final-scale: 1.03;
		--ring-color: var(--bg-color);
	}

	h1 {
		font-size: calc(48 / 16 * 1rem);
		color: var(--text-color);
		position: relative;
		z-index: 0;
		user-select: none;
		line-height: 0.85;
		display: inline-block;
		word-wrap: anywhere;
		hyphens: auto;
	}

	h1[data-small='true'] {
		font-size: calc(42 / 16 * 1rem);
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

	@media (min-width: 768px) {
		h1[data-small='false'] {
			font-size: calc(100 / 16 * 1rem);
		}
		h1[data-small='true'] {
			font-size: calc(84 / 16 * 1rem);
		}
	}

	@media (min-width: 940px), (min-width: 768px) and (min-aspect-ratio: 1) {
		.container {
			padding-top: calc(120 / 16 * 1rem);
		}
		.btn--huge {
			font-size: 7rem;
			top: 50%;
			right: 0;
			bottom: auto;
			transform: translateY(-50%) translateX(22%);
		}
	}

	@media (min-width: 940px) {
		h1[data-small='false'] {
			font-size: calc(128 / 16 * 1rem);
		}
		h1[data-small='true'] {
			font-size: calc(96 / 16 * 1rem);
		}
	}
</style>
