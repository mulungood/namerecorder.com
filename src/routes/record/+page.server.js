import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { redirect } from '@sveltejs/kit'

export async function load(event) {
	const { session } = await getSupabase(event)
	if (!session) {
		throw redirect(303, '/login')
	}
}
