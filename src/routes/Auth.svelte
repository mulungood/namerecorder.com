<script>
	import { supabase } from '../db'
	import { page } from '$app/stores'

	let email = ''
	let password = ''
	let helperText = { error: null, text: null }

	const handleLogin = async (type) => {
		const {
			data: { user },
			error,
		} =
			type === 'LOGIN'
				? await supabase.auth.signInWithPassword({ email, password })
				: await supabase.auth.signUp({
						email,
						password,
						options: { emailRedirectTo: `${$page.url.origin}/record` },
				  })

		if (error) {
			helperText = { error: true, text: error.message }
		} else if (!user && !error) {
			helperText = {
				error: false,
				text: 'An email has been sent to you for verification!',
			}
		}
	}
</script>

<div>
	<span> Login </span>
	<label for="email">
		<span>*</span>Email:
	</label>
	<input id="email" type="email" name="email" bind:value={email} required />
	<label for="password">
		<span>*</span>Password:
	</label>
	<input
		id="password"
		type="password"
		name="password"
		bind:value={password}
		required
	/>
	{#if !!helperText.text}
		<div>
			{helperText.text}
		</div>
	{/if}
	<div>
		<span>
			<button type="submit" on:click={() => handleLogin('REGISTER')}>
				Sign Up
			</button>
		</span>
		<span>
			<button on:click={() => handleLogin('LOGIN')} type="button">
				Sign In
			</button>
		</span>
	</div>
</div>
