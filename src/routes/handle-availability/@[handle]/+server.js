import { getUserIdFromHandle } from '../../../getUserFromHandle'

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const { handle } = params
	if (!handle) {
		return new Response(null, { status: 401 })
	}
	const { error, user } = await getUserIdFromHandle(handle)

	if (error) {
		return new Response(null, { status: 500 })
	}

	return new Response(JSON.stringify({ available: !user }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	})
}
