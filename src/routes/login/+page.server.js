import { fail, redirect } from '@sveltejs/kit'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'

export async function load(event) {
	const { session } = await getSupabase(event)
	if (session) {
		throw redirect(303, '/record')
	}
}

export const actions = {
	login: async (event) => {
		const { request } = event
		const { supabaseClient } = await getSupabase(event)
		const formData = await request.formData()

		const email = formData.get('email')
		const password = formData.get('password')

		const { error } = await supabaseClient.auth.signInWithPassword({
			email,
			password,
		})

		if (error) {
			if (error.status === 400) {
				return fail(400, {
					error: 'Invalid email & password combination',
					action: 'login',
					values: {
						email,
					},
				})
			}
			return fail(500, {
				error: 'Server error. Please try again.',
				action: 'login',
				values: {
					email,
				},
			})
		}

		return redirect(303, '/record')
	},

	signup: async (event) => {
		const { request } = event
		const { supabaseClient } = await getSupabase(event)
		const formData = await request.formData()

		const email = formData.get('email')
		const password = formData.get('password')

		const { error } = await supabaseClient.auth.signUp({
			email,
			password,
			options: { emailRedirectTo: new URL(request.url).origin + '/record' },
		})

		if (error) {
			if (error.status === 400 || error.status === 422) {
				return fail(400, {
					error: 'Invalid email or password.',
					action: 'signup',
					values: {
						email,
					},
				})
			}
			return fail(500, {
				error: 'Server error. Try again later.',
				action: 'signup',
				values: {
					email,
				},
			})
		}

		throw redirect(303, '/confirm-signup')
	},

	signout: async (event) => {
		const { supabaseClient } = await getSupabase(event)
		await supabaseClient.auth.signOut()
		throw redirect(303, '/login')
	},
}
