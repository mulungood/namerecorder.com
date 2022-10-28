<script>
	import { browser } from '$app/environment'
	import { page, updated } from '$app/stores'

	let email = $page.form?.values?.email || ''
	let password = ''
	let helperText = { error: null, text: null }

	let action =
		$page.form?.action ||
		(browser && localStorage.getItem('has-logged-before') === 'true'
			? 'login'
			: 'signup')
</script>

<svelte:head>
	<title>Login | {$page.url.host}</title>
</svelte:head>

<form method="POST" action="?/{action}" class="container text-md">
	<h1 class="text-lg">
		{action === 'signup' ? 'Create an account' : 'Welcome back 👋'}
	</h1>

	{#if $page.form?.error}
		<div class="error">
			<h2>{$page.form.error}</h2>
		</div>
	{/if}

	<label for="email">
		<div class="text-sm">Email:</div>
		<input id="email" type="email" name="email" bind:value={email} required />
	</label>
	<label for="password">
		<div class="text-sm">Password:</div>
		<input
			id="password"
			type="password"
			name="password"
			bind:value={password}
			required
		/>
	</label>
	{#if !!helperText.text}
		<div>
			{helperText.text}
		</div>
	{/if}
	<div class="actions-footer">
		<button
			type="submit"
			class="btn"
			data-color={action === 'signup' ? 'emerald' : 'violet'}
		>
			{action === 'signup' ? 'Sign-up' : 'Log-in'}
		</button>
		<button
			type="button"
			on:click={() => {
				action = action === 'signup' ? 'login' : 'signup'
			}}
			class="switch-action text-sm btn btn--underline"
			data-color="orange"
			>{action === 'signup'
				? 'I already have an account'
				: 'Create new account'}</button
		>
	</div>
</form>

<style>
	form {
		max-width: calc(850 / 16 * 1rem);
		display: flex;
		flex-direction: column;
		gap: 0.75em;
	}

	label {
		display: block;
		width: 100%;
	}

	input {
		color: var(--color-tailwind-slate-700);
	}

	h1 {
		line-height: 1;
	}

	.actions-footer {
		justify-content: space-between;
	}

	.switch-action {
		text-align: right;
	}

	.error {
		background: var(--color-tailwind-red-50);
		border: 2px solid currentColor;
		color: var(--color-tailwind-red-900);
		padding: 0.85em;
		border-radius: 0.35em;
		max-width: calc(600 / 16 * 1rem);
		font-size: calc(28 / 16 * 1rem);
		position: relative;
		z-index: 10;
		line-height: 1.35;
		margin-top: 1em;
	}
</style>
