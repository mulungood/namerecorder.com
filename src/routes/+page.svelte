<script>
	import { useMachine } from '@xstate/svelte'
	import { onMount } from 'svelte'
	import { assign } from 'xstate'
	import { recorderMachine } from './recorder.machine'
	import Timer from './Timer.svelte'
	import { supabase } from '../db'
	import Auth from './Auth.svelte'

	let user

	const { state, send } = useMachine(recorderMachine, {
		actions: {
			assignName: assign({
				name: (_context, event) => event.data,
			}),
			assignHandle: assign({
				handle: (_context, event) => event.data,
			}),
			assignMicRecorder: assign({
				micRecorder: (_context, event) => event.data,
			}),
			assignRecordingBlob: assign({
				recordingBlob: (_context, event) => event.data,
				micRecorder: undefined,
			}),
			cancelRecording: assign({
				micRecorder: (context) => {
					context?.micRecorder?.stop()
					return undefined
				},
			}),
			startRecording: (context) => context.micRecorder?.start?.(),
		},
		services: {
			verifyHandle: (context) =>
				new Promise(async (resolve, reject) => {
					console.log({ verify: context })
					if (!context.handle) return reject('invalid-handle')

					try {
						const availability = await (
							await fetch(`/handle-availability/@${context.handle}`)
						).json()
						console.log({ availability })
						if (availability.available === true) {
							resolve(true)
						} else {
							reject('unavailable')
						}
					} catch (error) {
						console.log({ error })
						reject(error)
					}
				}),
			requestMicAccess: () =>
				new Promise((resolve, reject) => {
					navigator.mediaDevices
						.getUserMedia({ video: false, audio: true })
						.then((stream) => {
							resolve(new MediaRecorder(stream))
						})
						.catch((error) => {
							reject(error)
						})
				}),
			persistRecording: (context) =>
				new Promise((resolve, reject) => {
					if (context?.micRecorder.state !== 'recording') {
						return reject()
					}
					context.micRecorder.ondataavailable = (e) => {
						const blob = new Blob([e.data], {
							type: 'audio/mp3',
						})
						context.micRecorder.ondatavailable = undefined

						resolve(blob)
					}
					context.micRecorder.stop()
				}),
			uploadFile: (context) =>
				new Promise(async (resolve, reject) => {
					const file = new File(
						[context.recordingBlob],
						`${user.id}/pronounciation.mp3`,
					)
					const storageRes = await supabase.storage
						.from('pronunciations')
						.upload(file.name, file, { upsert: true })
					console.log({ storageRes })
					if (storageRes.error) {
						return reject(storageRes.error)
					}
					const rowRes = await supabase.from('user_data').upsert({
						user_id: user.id,
						handle: context.handle,
						name: context.name,
					})
					console.log({ rowRes })
					if (rowRes.error) {
						return reject(rowRes.error)
					}
					resolve({
						storage: storageRes.data,
						row: rowRes.data,
					})
				}),
		},
		guards: {
			isLoggedIn: () => !!user?.id,
			hasValidNameAndHandle: (context, _event, { state }) => {
				return (
					!!context.name &&
					context.name.length >= 2 &&
					state.matches('nameForm.handleAvailable')
				)
			},
		},
	})

	onMount(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			user = session?.user ?? null
		})

		const { subscription: authListener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				const currentUser = session?.user
				user = currentUser ?? null
			},
		)

		return () => {
			authListener?.unsubscribe()
		}
	})

	$: console.log({ ctx: $state.context, user })
</script>

{#if !user}
	<Auth />
{:else}
	<pre>{JSON.stringify(
			{ value: $state.value, context: $state.context },
			null,
			2,
		)}</pre>
	{#if $state.matches('nameForm')}
		<label>
			First, tell us your name
			<input
				placeholder="Your name here"
				value={$state.context.name}
				on:input={(e) => send({ type: 'MODIFY_NAME', data: e.target.value })}
			/>
		</label>
		<label>
			https://nombre.is/@
			<input
				placeholder="your-name-here"
				value={$state.context.handle}
				on:input={(e) => send({ type: 'MODIFY_HANDLE', data: e.target.value })}
			/>
			{#if $state.matches('nameForm.verifyingHandle')}
				<div aria-live="polite">Verifying availability...</div>
			{/if}
			{#if $state.matches('nameForm.handleUnavailable')}
				<div aria-live="assertive">Handle already taken. Try another one</div>
			{/if}
			{#if $state.matches('nameForm.handleAvailable')}
				<div aria-live="polite">Handle available 🎉</div>
			{/if}
		</label>
		<button
			on:click|preventDefault={() => send('REQUEST_ACCESS')}
			type="button"
			disabled={!$state.can('REQUEST_ACCESS')}
		>
			Record name <svg
				viewBox="0 0 32 32"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M4 16C4 15.6022 4.15804 15.2206 4.43934 14.9393C4.72064 14.658 5.10218 14.5 5.5 14.5H23.074L16.5 8.61799C16.2061 8.35206 16.0295 7.98065 16.0086 7.58489C15.9877 7.18912 16.1243 6.80118 16.3885 6.50578C16.6527 6.21039 17.0231 6.03157 17.4187 6.00837C17.8143 5.98518 18.2031 6.1195 18.5 6.38199L28 14.882C28.1573 15.0227 28.2831 15.195 28.3693 15.3876C28.4554 15.5803 28.5 15.789 28.5 16C28.5 16.211 28.4554 16.4197 28.3693 16.6123C28.2831 16.805 28.1573 16.9773 28 17.118L18.5 25.618C18.3534 25.7507 18.182 25.853 17.9957 25.9192C17.8094 25.9854 17.6119 26.0141 17.4144 26.0037C17.217 25.9933 17.0235 25.9439 16.8452 25.8585C16.6669 25.773 16.5073 25.6532 16.3755 25.5058C16.2437 25.3585 16.1423 25.1865 16.0772 24.9998C16.0121 24.8131 15.9845 24.6154 15.9961 24.418C16.0076 24.2206 16.0581 24.0275 16.1446 23.8497C16.2311 23.6719 16.3519 23.5129 16.5 23.382L23.074 17.5H5.5C5.10218 17.5 4.72064 17.342 4.43934 17.0606C4.15804 16.7793 4 16.3978 4 16Z"
					fill="#7F1D1D"
				/>
			</svg>
		</button>
	{/if}

	{#if $state.matches('requestingMicAccess')}
		<p>We need access to your microphone to record your pronunciation</p>
		<p>SPINNER</p>
	{/if}

	{#if $state.matches('recording')}
		<Timer />
		<button
			on:click|preventDefault={() => send('STOP_RECORDING')}
			type="button"
		>
			<svg viewBox="0 0 16 16">
				<path
					fill="currentColor"
					d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm5-3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H6Z"
				/>
			</svg>
			<span class="sr-only">Stop</span>
		</button>
		<button
			on:click|preventDefault={() => send('CANCEL_RECORDING')}
			type="button"
			><svg viewBox="0 0 16 16"
				><path
					fill="currentColor"
					d="M7 3h2a1 1 0 0 0-2 0ZM6 3a2 2 0 1 1 4 0h4a.5.5 0 0 1 0 1h-.564l-1.205 8.838A2.5 2.5 0 0 1 9.754 15H6.246a2.5 2.5 0 0 1-2.477-2.162L2.564 4H2a.5.5 0 0 1 0-1h4Zm1 3.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0v-5ZM9.5 6a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5Zm-4.74 6.703A1.5 1.5 0 0 0 6.246 14h3.508a1.5 1.5 0 0 0 1.487-1.297L12.427 4H3.573l1.187 8.703Z"
				/></svg
			>
			<span class="sr-only">Cancel</span>
		</button>
	{/if}
	{#if $state.matches('recorded')}
		{#if $state.context.recordingBlob}
			<audio src={URL.createObjectURL($state.context.recordingBlob)} controls />
		{/if}
		<button on:click={() => send('UPLOAD_RECORDING')}>Upload</button>
	{/if}
{/if}

<!-- Goal: record audio file based on microphone and have it ready for uploading -->
<!-- WONTDO today: uploading itself, nice UI, API routing to existing recordings, auth - PURELY CLIENT_SIDE -->

<!-- 
  Next steps:
  1. ✅ button for recording
  2. ✅ Request microphone access to browser
  3. ✅ Recording state w/ stop & cancel
    - Transform recording into audio file - READ MDN
  4. ✅ Recorded state with player for the audio file
  5. ❌ Dropzone for audio file - **gave up on file uploading - non-critical flow**
  6. ❌ Parse the audio file from dropzone and have it in the internal state of the machine
  7. ✅ Add a timer in the recording state to stop recording - limit the size of recordings (15s?)
  8. ❌ Prevent uploading audio files longer than 15s
  9. Visualize audio: https://github.com/mdn/dom-examples/blob/e9ee0e48efb6158878dbfe70878d3663f52ab6f7/media/web-dictaphone/scripts/app.js#L116
  10. ❌ Is .ogg the best format? What about mp3 et. al? - will settle on mp3 for now
  11. ❌ Can we dispose of the MediaStream/Device after recording so the mic icon won't show up in the browser? - non-critical
	12. ❌ Send to Cloudflare R2 storage - gave up, too clunky
	13. ✅ Auth with Supabase
	14. ✅ Send to Supabase storage
	15. ✅ Add row to Supabase's aliases table
		- perhaps through a webhook / listener inside Supabase for reliability?
	16. ✅ API endpoint for resolving pronunciation mp3 for given ID
	17. ✅ Front-end route with alias displayed & audio player for pronunciation
	18. Attach written name to pronunciation
	19. Styling

	BONUS:
	- Allow multiple aliases per user
	- Ensure bucket's RLS security is top-notch
		- Didn't work: ((bucket_id = 'names'::text) AND (role() = 'authenticated'::text) AND (name = (uid())::text))
	- Read token for server db client that can read from `aliases` without opening it up to the public
		- Then delete open policy in db
		- Perhaps do a secret instead of a token?
 -->
