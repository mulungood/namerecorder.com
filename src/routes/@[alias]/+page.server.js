import { error as errorResponse } from '@sveltejs/kit'
import { getUserIdFromAlias } from '../../getUserIdFromAlias'

export async function load({ params }) {
	const { alias } = params
	if (!alias) {
		throw errorResponse(401, { message: 'invalid-alias' })
	}

	const { error, user_id } = await getUserIdFromAlias(`@${alias}`)
	if (error || !user_id) {
		throw errorResponse(404, { message: 'user-not-found' })
	}

	return { user_id, alias }
}
