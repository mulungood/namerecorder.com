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
  5. ❌ Dropzone for audio file - **gave up on file uploading - non-critical flow**
  6. ❌ Parse the audio file from dropzone and have it in the internal state of the machine
  7. Add a timer in the recording state to stop recording - limit the size of recordings (15s?)
  8. Prevent uploading audio files longer than 15s
  9. Visualize audio: https://github.com/mdn/dom-examples/blob/e9ee0e48efb6158878dbfe70878d3663f52ab6f7/media/web-dictaphone/scripts/app.js#L116
  10. Is .ogg the best format? What about mp3 et. al?
  11. Can we dispose of the MediaStream/Device after recording so the mic icon won't show up in the browser?
 -->
