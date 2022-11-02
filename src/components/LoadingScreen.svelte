<script>
	import LoadingSpinner from './icons/LoadingSpinner.svelte'

	export let title
</script>

<div aria-live="polite" class="header text-md">
	<LoadingSpinner />

	{#if title}
		<p>
			{title}
		</p>
	{/if}
</div>

<style>
	div {
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: calc(30 / 16 * 1rem);
	}

	div :global(svg) {
		width: calc(120 / 16 * 1rem);
		color: var(--color-tailwind-slate-300);
	}
</style>
