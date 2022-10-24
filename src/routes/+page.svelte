<script>
	import { useMachine } from '@xstate/svelte'
	import { assign } from 'xstate'
	import { recorderMachine } from './recorder.machine'

	const { state, send } = useMachine(recorderMachine, {
		actions: {
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
		},
	})

	$: console.log({ ctx: $state.context })
</script>

<h1>Record pronunciation</h1>

<h2>{$state.value}</h2>

{#if $state.matches('idle')}
	<label>
		Upload an audio file
		<input type="file" accept="audio/*" />
	</label>
	<button on:click|preventDefault={() => send('REQUEST_ACCESS')} type="button"
		><svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M16 4C14.6739 4 13.4021 4.52678 12.4645 5.46447C11.5268 6.40215 11 7.67392 11 9V16C11 17.3261 11.5268 18.5979 12.4645 19.5355C13.4021 20.4732 14.6739 21 16 21C17.3261 21 18.5979 20.4732 19.5355 19.5355C20.4732 18.5979 21 17.3261 21 16V9C21 7.67392 20.4732 6.40215 19.5355 5.46447C18.5979 4.52678 17.3261 4 16 4V4ZM8 15C8.26522 15 8.51957 15.1054 8.70711 15.2929C8.89464 15.4804 9 15.7348 9 16C9 17.8565 9.7375 19.637 11.0503 20.9497C12.363 22.2625 14.1435 23 16 23C17.8565 23 19.637 22.2625 20.9497 20.9497C22.2625 19.637 23 17.8565 23 16C23 15.7348 23.1054 15.4804 23.2929 15.2929C23.4804 15.1054 23.7348 15 24 15C24.2652 15 24.5196 15.1054 24.7071 15.2929C24.8946 15.4804 25 15.7348 25 16C25.0004 18.2141 24.1847 20.3507 22.7088 22.0011C21.2329 23.6515 19.2004 24.7 17 24.946V27C17 27.2652 16.8946 27.5196 16.7071 27.7071C16.5196 27.8946 16.2652 28 16 28C15.7348 28 15.4804 27.8946 15.2929 27.7071C15.1054 27.5196 15 27.2652 15 27V24.946C12.7996 24.7 10.7671 23.6515 9.29122 22.0011C7.81532 20.3507 6.99958 18.2141 7 16C7 15.7348 7.10536 15.4804 7.29289 15.2929C7.48043 15.1054 7.73478 15 8 15Z"
				fill="currentColor"
			/>
		</svg>
		Record</button
	>
	<p>You’ll be prompted by your browser to give access to your microphone</p>
{/if}

{#if $state.context.micStream}
	<h2>Audio</h2>
	<audio srcObject={$state.context.micStream} />
	<audio src="https://developer.mozilla.org/media/cc0-audio/t-rex-roar.mp3" />
{/if}

{#if $state.matches('recorded')}
	{#if $state.context.recordingBlob}
		<audio
			src={URL.createObjectURL($state.context.recordingBlob)}
			autoplay
			controls
		/>
	{/if}
{/if}

{#if $state.matches('recording')}
	<button on:click|preventDefault={() => send('STOP_RECORDING')} type="button">
		<svg viewBox="0 0 16 16">
			<path
				fill="currentColor"
				d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm5-3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H6Z"
			/>
		</svg>
		<span class="sr-only">Stop</span>
	</button>
	<button on:click|preventDefault={() => send('CANCEL_RECORDING')} type="button"
		><svg viewBox="0 0 16 16"
			><path
				fill="currentColor"
				d="M7 3h2a1 1 0 0 0-2 0ZM6 3a2 2 0 1 1 4 0h4a.5.5 0 0 1 0 1h-.564l-1.205 8.838A2.5 2.5 0 0 1 9.754 15H6.246a2.5 2.5 0 0 1-2.477-2.162L2.564 4H2a.5.5 0 0 1 0-1h4Zm1 3.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0v-5ZM9.5 6a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5Zm-4.74 6.703A1.5 1.5 0 0 0 6.246 14h3.508a1.5 1.5 0 0 0 1.487-1.297L12.427 4H3.573l1.187 8.703Z"
			/></svg
		>
		<span class="sr-only">Cancel</span>
	</button>
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
  5. Dropzone for audio file
  6. Parse the audio file from dropzone and have it in the internal state of the machine
  7. Add a timer in the recording state to stop recording - limit the size of recordings (15s?)
  8. Prevent uploading audio files longer than 15s
  9. Visualize audio: https://github.com/mdn/dom-examples/blob/e9ee0e48efb6158878dbfe70878d3663f52ab6f7/media/web-dictaphone/scripts/app.js#L116
  10. Is .ogg the best format? What about mp3 et. al?
  11. Can we dispose of the MediaStream/Device after recording so the mic icon won't show up in the browser?
 -->
