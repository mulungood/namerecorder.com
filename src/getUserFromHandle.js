import { supabase } from './db'

export async function getUserIdFromHandle(alias) {
	const { data, error } = await supabase
		.from('user_data')
		.select()
		.eq('handle', alias.replace('@', ''))

	return {
		user: data?.[0],
		error,
	}
}
