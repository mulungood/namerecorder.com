import { createMachine } from 'xstate'

// 15s (in ms)
export const MAX_DURATION = 15000
// 3s (in ms)
export const COUNTDOWN_DURATION = 3000

export const recorderMachine =
	/** @xstate-layout N4IgpgJg5mDOIC5QCcwGMD2yJmQOgDsBDAWzADEsS8ALI2AOTAHcAJIgiAGzAGIAPWABciQsHiIAzMcgAUAVgAMigJS9UmbLkKkKVWvSZsO3MAG1FAXUSgADhlgBLIY4wEbIfogAc3xXgBmZXkAJkVvAIBGeT8AgBoQAE9EABYQlLx0gHYAThzFUIA2EMiQ7wBfcoSNLBx8YjJKZGoAN1xHSUTHAih2Th5eCDdxbpaMAGtxNuQOxL7TC2skEHsnFzcPLwRIgJCQvByArJKQrOO9kITkhADCgLwUgMfCrPlbqKfK6vRa7Qa9Zp4aazbq9EwDXDILB4WxcUSSfTAzrzHiLDyrZyudzLLY7PYHI4nM4XS5JVIhe4pSIpQryLKRHJlXJvL4gGpaeq6JokXgAJQAogBFACq-IAygAVAD6AEEAMJy8VitHLDHrbGgLaMq6ISKRO54PVKY4vLLKW6s9l1HSNKi8ACyAHkACIASXIAE0pQwZfb+Sq7A5MRscbrIvS8IpIopbspFClfPIdQh5DlInhvIU8d4cvI3rdCpafhybQCeU63Z6pawZQxnQAZf1WdFB9WbRBvfx5V65tPRJ7xMkIFLKPCpunxw65mKFqps4vW1AARwArnAXD17Y40DK0Gg4LBBsM8KMJuJl2vhFud3uDwGVq2se3tqTrqUi5pF2BV+vQdfd-usCHpC0KwvC+gXuu-63kB95qk+oYpq+uo5hkoTeCkuS0lktzeFkH6-PgVqgngmArgQQhDMwBACMIojiFIMiyEEyhqFa2jET0pEYORlEYNRcGPiGmqIAAtCEMQHDkdx3DEnbIQghz7LcIRprmCYFN48gESWnFQHgem0SIYgSNIuCyNEcZsQuHELiRemCWsCEiQgqnpik+SFFpOTHAyA7JjkaSBHsOR+IyQRedpc7sURdk9Lwcq1oq9ZSgKcqOryboMAA4o5wYap4iCnOmoQJpmWRUomkTJhJ8gPJ20m5nqDI4TpX6fqCvCSo6AAKqX8ulmWujleVtohZQlekvgvJVWnVUOOHeIaASldGISFLms7fJ+tk7RAfL8hKMoANL8v1g1ZblzaqkJBVbN4CmlBheCFAUJR3L4mF7G1u2-Ptwo9fWjoys650ZZdo3OYVrl6oUGZBAEKleeE4bJvIBoRHqxKhIcWQVNFNmxXtvAA0DINg0NI2REsgZOcJ0MlPq8MxkjfjeKjQ5ZnV7PRFpbkROzP34CusIYEQECdUMBAjAQYyTHgItcGLEDkI4qLXbT+XPit+yZqmjyI2cePScm1KKHDijSVkLwrXkflCwrovi51IH4GBQgIoCivK6r6s0w+dN3YgKkZrSgWI0cZw5oUpvyNGkZ0jEA7Eg73vi-yyBQsgB0SryHqQ-TWwh3r4eG1HJtDtSkmKGc4ZvKF7M+anTsQBnWcJUl-IpaTwPOgXQcIF5WQZqFjyYYFYR6rH8aZKcdwBOzK30iEDu2LgTjCKCvJxVAR7SyestnjC6+OMI28dT0-fPnX9zpB8FJPHS3how9hqFI8kSY9S30Eztbsn5vHo59agu0zqBOEHt9Br2QBvIQwDsCgivohB6S1TgxBKH4OO0QY4LSOIERQYR1o13HPhX+hEDI7zblgHOJ0zppXBsNK6-t4KFw7I9O4JVx7WweqES2s45wEAwDgeAywYqlm5CeUwLZA7PjpDkPAOFSg12pH4Ahz8hxKHkb4S2YQ0zvwtGQks-wJF0EYCwFEYBpFa0QvSYe8gRwRSzHPCIyY0gZAqrkfIRQTj422uQ4xiJ2idFBBYqxY0XJrThnqNIUQvKyUeMmBedUJJpgCJtWkQR0YOwCYCOg-QwAyhaEQNWRAABGPAwlQ1xEUSMkUtJPBroUHB1x3gEmeK8d4OwUjZK5PoPJphhTECKSU8pliboyMQtEdatStL1JHNbZp5J7hpkwq8ROJQjhRT8UY3pzRKmsOHK-bs44+xvASUOU4GQUhP10WPEc1IHaQUAVAaCgERGa3CdDXwdjqQ7Hfv81M6i3zrXuFmPUygNoaW6YY9qICuJkQolRAqLCB6iV2PI3MFU8wEI8h5dIyZppv0eLkIIuZ1qREeTvChF8oD7NRSUeR6N37SRWk8LmptzSZAiFmXM8ZMEBEpTSulz40VnAOHSa5Sh0iBUZCkZMuRh6fzxicaInjoXbNhVoCAwrJmhThn4NIXlMLhhWcmV6cNYmvX1O-FImEBUwu0GnCWPQdUuTOKbGk9xdg7BWn4PG9iV4OvwFLMZHyqkdipG-d+GEyiI28h682kZ1J+uiPkdV84-4KyGcUuEozryuoZocMcvLQg4XyLVU2OY6pqMBTGHyMZm5K3TmA5ABatj2KWq9dmJQYmJiBbqJQ7i55xp2HSd8Qbj4wNPhuKA8DnW0vGdYlymEloMnZlSJ6YQ7hmryIaGk9iPK7B7YKuFUAqGtsXZ83EBR5GnB5uSnM1s5W4OHn4Qhr0ex0myWASAsB6wYCgK6ZFt1nwvFjhGdGrwh6ZlJfajVuA21iTSHVTFkqcUyvxUOUS1sDjW2NJssIdJSGVCAA */
	createMachine({
		context: {
			micRecorder: undefined,
			recordingBlob: undefined,
			name: '',
			handle: '',
			handleTouched: false,
		},
		preserveActionOrder: true,
		predictableActionArguments: true,
		initial: 'nameForm',
		states: {
			nameForm: {
				initial: 'idle',
				states: {
					idle: {},
					hasNewHandle: {
						after: {
							500: {
								target: '#recorder.nameForm.verifyingHandle',
								actions: [],
								internal: false,
							},
						},
					},
					verifyingHandle: {
						invoke: {
							src: 'verifyHandle',
							id: 'verifyHandle',
							onDone: [
								{
									target: 'handleAvailable',
								},
							],
							onError: [
								{
									target: 'handleUnavailable',
								},
							],
						},
					},
					handleAvailable: {},
					handleUnavailable: {},
				},
				on: {
					REQUEST_ACCESS: {
						target: 'requestingMicAccess',
						cond: 'hasValidNameAndHandle',
					},
					MODIFY_NAME: {
						actions: 'assignName',
					},
					MODIFY_HANDLE: {
						target: '.hasNewHandle',
						actions: 'assignHandle',
					},
				},
			},
			requestingMicAccess: {
				invoke: {
					src: 'requestMicAccess',
					id: 'requestMicAccess',
					onDone: [
						{
							target: 'recording',
							actions: 'assignMicRecorder',
						},
					],
					onError: [
						{
							target: 'unavailableMic',
						},
					],
				},
			},
			recording: {
				initial: 'countdown',
				states: {
					countdown: {
						after: {
							[COUNTDOWN_DURATION]: {
								target: '#recorder.recording.recording',
								actions: [],
								internal: false,
							},
						},
					},
					recording: {
						entry: 'startRecording',
						after: {
							[MAX_DURATION]: {
								target: '#recorder.persistingRecording',
								actions: [],
								internal: false,
							},
						},
					},
				},
				on: {
					CANCEL_RECORDING: {
						target: '#recorder.nameForm.verifyingHandle',
						actions: 'cancelRecording',
					},
					STOP_RECORDING: {
						target: 'persistingRecording',
					},
				},
			},
			recorded: {
				on: {
					RETAKE_RECORDING: {
						target: 'requestingMicAccess',
					},
					UPLOAD_RECORDING: [
						{
							target: 'uploading',
							cond: 'isLoggedIn',
						},
						{
							target: 'needsLogIn',
						},
					],
				},
			},
			uploading: {
				invoke: {
					src: 'uploadFile',
					id: 'uploadFile',
					onDone: [
						{
							target: 'done',
						},
					],
					onError: [
						{
							target: 'uploadError',
						},
					],
				},
			},
			done: {
				type: 'final',
			},
			unavailableMic: {},
			uploadError: {
				on: {
					RETRY: {
						target: 'uploading',
					},
					CANCEL_UPLOAD: {
						target: 'requestingMicAccess',
					},
				},
			},
			persistingRecording: {
				invoke: {
					src: 'persistRecording',
					id: 'persistRecording',
					onDone: [
						{
							target: 'recorded',
							actions: 'assignRecordingBlob',
						},
					],
					onError: [
						{
							target: 'recordingError',
						},
					],
				},
			},
			recordingError: {
				on: {
					RETAKE_RECORDING: {
						target: 'requestingMicAccess',
					},
				},
			},
			needsLogIn: {},
		},
		id: 'recorder',
	})
