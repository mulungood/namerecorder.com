import { error as errorResponse } from '@sveltejs/kit'
import { getRandomArrItem } from '../../arrays'
import { getUserIdFromHandle } from '../../getUserFromHandle'

export async function load({ params }) {
	const { handle } = params
	if (!handle) {
		throw errorResponse(401, { message: 'invalid-handle' })
	}

	const { error, user } = await getUserIdFromHandle(handle)
	if (error || !user?.user_id) {
		throw errorResponse(404, { message: 'user-not-found' })
	}

	return {
		user,
		handle,
		pageColor: getRandomArrItem(['emerald', 'red', 'violet', 'orange']),
	}
}
