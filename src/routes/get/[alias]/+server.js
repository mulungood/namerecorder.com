import { getObjectUrl } from '../../../getObjectUrl'
import { getUserIdFromAlias } from '../../../getUserIdFromAlias'

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const { alias } = params
	if (!alias) {
		return new Response(null, { status: 401 })
	}
	const { error, user_id } = await getUserIdFromAlias(alias)

	console.info({ error, alias, user_id })

	if (error || !user_id) {
		return new Response(null, { status: 404 })
	}

	return rewriteRequest(getObjectUrl(user_id))
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
