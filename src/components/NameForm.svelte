<script>
	import { slugify } from '../strings'

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
		Record name <svg
			viewBox="0 0 32 32"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M4 16C4 15.6022 4.15804 15.2206 4.43934 14.9393C4.72064 14.658 5.10218 14.5 5.5 14.5H23.074L16.5 8.61799C16.2061 8.35206 16.0295 7.98065 16.0086 7.58489C15.9877 7.18912 16.1243 6.80118 16.3885 6.50578C16.6527 6.21039 17.0231 6.03157 17.4187 6.00837C17.8143 5.98518 18.2031 6.1195 18.5 6.38199L28 14.882C28.1573 15.0227 28.2831 15.195 28.3693 15.3876C28.4554 15.5803 28.5 15.789 28.5 16C28.5 16.211 28.4554 16.4197 28.3693 16.6123C28.2831 16.805 28.1573 16.9773 28 17.118L18.5 25.618C18.3534 25.7507 18.182 25.853 17.9957 25.9192C17.8094 25.9854 17.6119 26.0141 17.4144 26.0037C17.217 25.9933 17.0235 25.9439 16.8452 25.8585C16.6669 25.773 16.5073 25.6532 16.3755 25.5058C16.2437 25.3585 16.1423 25.1865 16.0772 24.9998C16.0121 24.8131 15.9845 24.6154 15.9961 24.418C16.0076 24.2206 16.0581 24.0275 16.1446 23.8497C16.2311 23.6719 16.3519 23.5129 16.5 23.382L23.074 17.5H5.5C5.10218 17.5 4.72064 17.342 4.43934 17.0606C4.15804 16.7793 4 16.3978 4 16Z"
			/>
		</svg>
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
