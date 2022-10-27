<script>
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
</script>

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

		<a href="/" tabindex={1} class="text-md">nombre.is</a>
	</div>

	<audio
		src={getObjectUrl(data.user?.user_id)}
		bind:this={audioEl}
		on:ended={() => (playing = false)}
	/>
	<button
		class="btn play-btn"
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
	.container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
	}
</style>
