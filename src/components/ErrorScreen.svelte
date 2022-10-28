<script>
	export let title
	export let subtitle
</script>

<div aria-live="assertive" class="header text-md">
	<div>
		{#if title}
			<h1 data-has-subtitle={!!subtitle}>
				{title}
			</h1>
		{/if}
		{#if subtitle}
			<p>
				{subtitle}
			</p>
		{/if}
	</div>

	<slot />
</div>

<style>
	.header {
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: calc(30 / 16 * 1rem);
	}

	h1[data-has-subtitle='false'] {
		font-weight: normal;
	}
	h1[data-has-subtitle='true'] {
		font-weight: bold;
	}
</style>
