<script>
	import { page } from '$app/stores'
</script>

<svelte:head>
	<title>{$page.url.host} | Say names right</title>
</svelte:head>

<div class="container" data-color="orange">
	<h1 class="text-lg">Say names right</h1>

	<p class="text-md">
		Send {$page.url.host} to friends & colleagues to practice pronouncing their names
		perfectly.
	</p>

	<a href="/record" class="btn">Record your name</a>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: flex-start;
		max-width: calc(940 / 16 * 1rem);
	}
	p {
		color: var(--color-tailwind-slate-600);
	}
</style>
