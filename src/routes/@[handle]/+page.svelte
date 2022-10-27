<script>
	import { page } from '$app/stores'
	import { getObjectUrl } from '../../getObjectUrl'

	export let data

	let audioEl
	let playing = false

	$: if (playing) {
		audioEl?.play?.()
	} else {
		audioEl?.pause?.()
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
	/>
	<button
		class="btn play-btn btn--huge"
		on:click={() => (playing = !playing)}
		tabindex={0}
	>
		<span class="sr-only">Play audio</span>
		{#if playing}
			<svg
				viewBox="0 0 114 114"
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M16.9336 0.527832C12.5824 0.527832 8.40939 2.25634 5.33262 5.33311C2.25586 8.40988 0.527344 12.5829 0.527344 16.9341V96.6216C0.527344 105.678 7.87734 113.028 16.9336 113.028H30.9961C35.3473 113.028 39.5203 111.299 42.5971 108.223C45.6738 105.146 47.4023 100.973 47.4023 96.6216V16.9341C47.4023 12.5829 45.6738 8.40988 42.5971 5.33311C39.5203 2.25634 35.3473 0.527832 30.9961 0.527832H16.9336ZM82.5586 0.527832C78.2074 0.527832 74.0344 2.25634 70.9576 5.33311C67.8809 8.40988 66.1523 12.5829 66.1523 16.9341V96.6216C66.1523 105.678 73.5023 113.028 82.5586 113.028H96.6211C100.972 113.028 105.145 111.299 108.222 108.223C111.299 105.146 113.027 100.973 113.027 96.6216V16.9341C113.027 12.5829 111.299 8.40988 108.222 5.33311C105.145 2.25634 100.972 0.527832 96.6211 0.527832H82.5586Z"
				/>
			</svg>
		{:else}
			<svg
				viewBox="0 0 337 367"
				fill="currentColor"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M68.6023 6.13999C61.6335 2.22275 53.7608 0.197602 45.7667 0.265829C37.7726 0.334055 29.9356 2.49329 23.0346 6.5289C16.1336 10.5645 10.409 16.336 6.42975 23.2696C2.45049 30.2032 0.355163 38.0576 0.352053 46.0519V320.885C0.349833 328.882 2.44128 336.741 6.41836 343.678C10.3954 350.616 16.1196 356.392 23.0214 360.431C29.9233 364.47 37.7624 366.632 45.7591 366.702C53.7557 366.771 61.6312 364.746 68.6023 360.828L312.899 223.411C319.985 219.427 325.882 213.629 329.987 206.612C334.092 199.596 336.255 191.613 336.255 183.484C336.255 175.355 334.092 167.372 329.987 160.355C325.882 153.339 319.985 147.541 312.899 143.557L68.6023 6.13999V6.13999Z"
				/>
			</svg>
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
	}

	.btn--huge:hover svg {
		transform: scale(1.015);
		color: white;
	}

	h1 {
		font-size: calc(128 / 16 * 1rem);
		color: var(--text-color);
		word-wrap: anywhere;
		position: relative;
		z-index: 10;
		user-select: none;
		line-height: 0.85;
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
