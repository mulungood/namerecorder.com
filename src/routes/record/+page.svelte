<script>
	import { goto } from '$app/navigation'
	import { useMachine } from '@xstate/svelte'
	import { assign } from 'xstate'
	import ErrorScreen from '../../components/ErrorScreen.svelte'
	import RetakeIcon from '../../components/icons/RetakeIcon.svelte'
	import LoadingScreen from '../../components/LoadingScreen.svelte'
	import NameForm from '../../components/NameForm.svelte'
	import RecordedScreen from '../../components/RecordedScreen.svelte'
	import RecordingScreen from '../../components/RecordingScreen.svelte'
	import { supabase } from '../../db'
	import { userStore } from '../../userStore'
	import Auth from '../Auth.svelte'
	import { recorderMachine } from '../recorder.machine'

	$: user = $userStore.user

	const { state, send } = useMachine(recorderMachine, {
		actions: {
			assignName: assign({
				name: (_context, event) => event.data,
			}),
			assignHandle: assign({
				handle: (_context, event) => event.data,
				handleTouched: (_context, event) => event.touched || false,
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
					if (!context.handle) return reject('invalid-handle')

					try {
						const availability = await (
							await fetch(`/handle-availability/@${context.handle}`)
						).json()
						if (
							availability.available === true ||
							availability.used_by === user.id
						) {
							resolve(true)
						} else {
							reject('unavailable')
						}
					} catch (error) {
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
					if (!context.recordingBlob || !context.handle || !context.name) {
						reject('invalid-data')
					}

					const file = new File(
						[context.recordingBlob],
						`${user.id}/pronounciation.mp3`,
					)
					const storageRes = await supabase.storage
						.from('pronunciations')
						.upload(file.name, file, { upsert: true })
					if (storageRes.error) {
						return reject(storageRes.error)
					}
					const rowRes = await supabase.from('user_data').upsert({
						user_id: user.id,
						handle: context.handle,
						name: context.name,
					})
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

	$: console.log({ ctx: $state.context, user, value: $state.value })

	$: if ($state.matches('done')) {
		goto(`/@${$state.context.handle}?success=true`)
	}
</script>

<svelte:head>
	<title>Record your name's pronunciation</title>
</svelte:head>

{#if $userStore.state === 'loading'}
	<LoadingScreen />
{:else if !user}
	<Auth />
{:else}
	<!-- <pre>{JSON.stringify(
			{ value: $state.value, context: $state.context },
			null,
			2,
		)}</pre> -->

	{#if $state.matches('nameForm')}
		<NameForm {state} {send} />
	{/if}

	{#if $state.matches('requestingMicAccess')}
		<LoadingScreen
			title="We need access to your microphone to record your pronunciation"
		/>
	{/if}

	{#if $state.matches('recording')}
		<RecordingScreen {state} {send} />
	{/if}

	{#if $state.matches('recorded')}
		<RecordedScreen {state} {send} />
	{/if}

	{#if $state.matches('uploading')}
		<LoadingScreen title="Uploading recording..." />
	{/if}

	{#if $state.matches('uploadError')}
		<ErrorScreen title="There was an issue uploading your recording">
			<div class="actions-footer">
				<button
					class="btn"
					data-color="neutral"
					on:click={() => send('CANCEL_UPLOAD')}
				>
					<RetakeIcon /> Retake
				</button>
				<button class="btn" data-color="emerald" on:click={() => send('RETRY')}>
					Retry upload
				</button>
			</div>
		</ErrorScreen>
	{/if}

	{#if $state.matches('unavailableMic')}
		<ErrorScreen
			title="We need access to your microphone"
			subtitle="Open this page in a new tab and try again."
		>
			<div class="actions-footer">
				<button
					class="btn"
					data-color="emerald"
					on:click={() => window.open(window.location.href, '_blank')}
				>
					<RetakeIcon /> Reload page
				</button>
			</div>
		</ErrorScreen>
	{/if}

	{#if $state.matches('recordingError')}
		<ErrorScreen
			title="Something went wrong"
			subtitle="We couldn't process your recording, please try again"
		>
			<div class="actions-footer">
				<button
					class="btn"
					data-color="emerald"
					on:click={() => send('RETAKE_RECORDING')}
				>
					<RetakeIcon /> Retake
				</button>
			</div>
		</ErrorScreen>
	{/if}

	{#if $state.matches('needsLogin')}
		<ErrorScreen title="You must be logged in to submit a recording" />
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
	18. ✅ Attach written name to pronunciation
	19. ✅ Styling
	20. Better login form
	21. Proper homepage
	22. Favicon et. al

	BONUS:
	- Allow multiple aliases per user
	- Ensure bucket's RLS security is top-notch
		- Didn't work: ((bucket_id = 'names'::text) AND (role() = 'authenticated'::text) AND (name = (uid())::text))
	- Read token for server db client that can read from `aliases` without opening it up to the public
		- Then delete open policy in db
		- Perhaps do a secret instead of a token?
	- Add buffer timer before start recording (countdown timer)
	- Better flow for updating recording - jump straight into rec
	- Invite links ("Person X invited you to record your (...)")
 -->
