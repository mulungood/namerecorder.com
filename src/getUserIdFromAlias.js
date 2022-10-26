import { supabase } from './db'

export async function getUserIdFromAlias(alias) {
	const { data, error } = await supabase
		.from('aliases')
		.select('user_id')
		.eq('alias', alias)

	return {
		user_id: data?.[0]?.user_id,
		error,
	}
}
