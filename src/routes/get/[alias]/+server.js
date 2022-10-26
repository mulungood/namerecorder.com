import { env } from '$env/dynamic/public'
import { supabase } from '../../../db'

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const { alias } = params
	if (!alias) {
		return new Response(null, { status: 401 })
	}

	const { data, error } = await supabase
		.from('aliases')
		.select('user_id')
		.eq('alias', alias)

	const user_id = data?.[0]?.user_id

	console.info({ data, error, alias, user_id })

	if (error || !user_id) {
		return new Response(null, { status: 404 })
	}

	return rewriteRequest(
		`${env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/pronunciations/${user_id}/pronounciation.mp3`,
	)
}

async function rewriteRequest(targetUrl) {
	// Copied from https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream#fetch_stream
	return new Promise((resolve) => {
		fetch(targetUrl)
			.then((response) => response.body)
			.then((rb) => {
				const reader = rb.getReader()

				return new ReadableStream({
					start(controller) {
						// The following function handles each data chunk
						function push() {
							// "done" is a Boolean and value a "Uint8Array"
							reader.read().then(({ done, value }) => {
								// If there is no more data to read
								if (done) {
									controller.close()
									return
								}
								// Get the data and send it to the browser via the controller
								controller.enqueue(value)
								// Check chunks by logging to the console
								push()
							})
						}

						push()
					},
				})
			})
			.then((stream) =>
				// Respond with our stream
				resolve(new Response(stream)),
			)
	})
}
