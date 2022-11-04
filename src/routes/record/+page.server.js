import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { redirect } from '@sveltejs/kit'
import { supabase } from '../../db'

export async function load(event) {
	const { session } = await getSupabase(event)
	if (!session) {
		throw redirect(303, '/login')
	}

	const { data: userRowData } = await supabase
		.from('user_data')
		.select()
		.eq('user_id', session.user.id)
		.single()

	return {
		userRowData,
	}
}
