<script>
	import { slugify } from '../strings'
	import RightArrowIcon from './icons/RightArrowIcon.svelte'

	export let state
	export let send
</script>

<div class="container" data-color="emerald">
	<label class="name-input">
		<div class="text-md">First, tell us your name</div>
		<input
			placeholder="Your name here"
			value={$state.context.name}
			on:input={(e) => {
				send({ type: 'MODIFY_NAME', data: e.target.value })
				if (!$state.context.handleTouched) {
					send({ type: 'MODIFY_HANDLE', data: slugify(e.target.value) })
				}
			}}
		/>
	</label>

	<div class="handle">
		<label class="handle-input text-md">
			https://nombre.is/@
			<input
				placeholder="your-name-here"
				value={$state.context.handle}
				on:input={(e) =>
					send({ type: 'MODIFY_HANDLE', data: e.target.value, touched: true })}
			/>
		</label>
		{#if $state.matches('nameForm.verifyingHandle')}
			<div class="handle-info" aria-live="polite">
				Verifying availability...
			</div>
		{/if}
		{#if $state.matches('nameForm.handleUnavailable')}
			<div class="handle-info" aria-live="assertive">
				Handle already taken. Try another one
			</div>
		{/if}
		{#if $state.matches('nameForm.handleAvailable')}
			<div class="handle-info" aria-live="polite">Handle available 🎉</div>
		{/if}
	</div>

	<button
		on:click|preventDefault={() => send('REQUEST_ACCESS')}
		type="button"
		disabled={!$state.can('REQUEST_ACCESS')}
		class="btn"
	>
		Record name <RightArrowIcon />
	</button>
</div>

<style>
	.name-input input {
		font-size: calc(128 / 16 * 1rem);
	}
	input {
		border: transparent;
		background: transparent;
		font-weight: bold;
	}

	.handle-input {
		display: flex;
		gap: 0;
		align-items: center;
	}
	.handle-input input {
		display: inline-block;
		padding: 0;
	}

	.btn {
		margin-top: 2em;
	}
</style>
