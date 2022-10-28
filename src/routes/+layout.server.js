import { getServerSession } from '@supabase/auth-helpers-sveltekit'
import { getRandomArrItem } from '../arrays'

export const load = async (event) => {
	return {
		session: await getServerSession(event),
		pageColor: getRandomArrItem(['emerald', 'red', 'violet', 'orange']),
	}
}
