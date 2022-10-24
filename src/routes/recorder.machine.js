import { createMachine } from 'xstate'

export const MAX_DURATION = 10000

export const recorderMachine =
	/** @xstate-layout N4IgpgJg5mDOIC5QCcwGMD2yJmQOgEsIAbMAYgCUBRARQFUqBlAFQH0BBAYU6cYG0ADAF1EoAA4ZYBAC4EMAO1EgAHogBMAZgAsWvBo0CAbIYCcW-RoCsADgA0IAJ6JLatXhtrD1gOxrvVkyMAXyD7VExsXDxUAEcAVzhZeSgAWQI0djQ0OFgyCAUwQnkANwwAa0LYhNhpNIysnMERJBAJKVkFJVUETR09A2MzCxt7JwRrNxNvQxt9LQEtQx0QsPQsHHwqxIJkuszs2FzcZCw8MWIAQ2kAMywAW2iweMS9hsOmpTaZOUUW7rUTJZvHgBFMtNYNCYoZ4fKNnAJrHhvJYtJZLF5fIETABGFYgcLrKIE7A7KBkTjsAByPAAMqxqJwAPIUAAiAElKQBxD4tL4dX6gf4mQzuNTgxYaCE4yFwhCWIx4LR+BGA8ECFyAvHEjaPCIQUlkFiMgAK9KoTNZHO5wk+km+nT+6mFovFhklkOxMsciHm2Pc1hMEO82MC1gDuNC+LWkU20f1yUo5uZ7K5rE4AAk6JSANI88R2-ldeF4AMzczB7ETNEaWUaYN6bELGyB0E+NRauNEuMG5Q1K6FC7XaS4AAUjYEE4AlGRtV29aS860Cz8iz1nS5Xe7pSZa1oTHhDKC62ofAG1MFI7PY3rIInmOxs1QzRaU9bmvn2ivHeNrCKQ35vGsRYTH0bxvFlVxEWxENsSBPxIWsaCOxva9CQgQ0qEpFln2TK1Fz5L9BUQbE1BsPBAmRd00WRKZaxDPAAQ0Qxz0lPxPG8ZDCXwOJzgwC54zJfJ5EKHZSgqPAeOIPiIAAMQIUh8OXB0iIQbFvHMEFwWg1EBBhLRwO9BBtDcSwrEQyxAzrPdOJjCTeP4g1jlOc4rluZAHkk6S5IUm1eSUgUVGI9SNE0xDsR0vSDLGE9gTDLRoKMcxDBI0ibJ1Tz+KoZATmQO8KAATUUz9lMC1SJj9ax0WDX9LEbDRKwgqxyIEJiJXqpY60MNKogyiAspy8kqVpVg6GNGlGXYFkivtAL-gEbwBAPSF2M9AMFggiYQRRFqNFIiYgOxLrL07fAxFwKQalJChuwTISRJKcpCjO5ALuka752SabC2-X8RXmtFwR8SFdrsQyDD9fTPTRKF1VcbRutO86CEu5J3vWRzsucy4bnuM4kZqNGSU+3yPxm1dfpBZEUTDfwQJPWV5kW5EZhayqqZsEJI3kDAcHgFor0IEgwFtYrZvUTxFtI2rzHYwxgy0WUXBChEYV8fwLIvVYUMeZ4UdSdJ9hyEWye-PbEXFE8XHVHxAIZyqGMPSFAL0gMNAR3V0eSY3vpU-SGeRdxATlxCdH26x3dnCBvcI0roOgrbDv8KWgSBOj928EDmNZtivHd3rSWjkrunCoE8ErVwTz3ersQgwEkShRZPSY4wlg447tbuwuxdUkC-W0NajCsQ9YTBpV3G0PdkQW0jPEsPP5AuYoLnki4ACNSDqLvV3qwMDxMUjmLDUxrBaxXQQYlE0QxAFQQjLWuLsqTMsx5At+-EN6r0cFAkH9EESi9Qm0AY7T2pXQ67tnqvSujdKAb8VK1UsORMEAhDq1WqgAoyzEDwTjDI2MCao2731stqUk-UsBwNjqCfcbo5bD3qhnNEDMUEXxmExQEwpUSpXblxCh3QAC0NdDJ8KOiEIAA */
	createMachine({
		context: { micRecorder: undefined, recordingBlob: undefined },
		preserveActionOrder: true,
		predictableActionArguments: true,
		initial: 'idle',
		states: {
			idle: {
				on: {
					REQUEST_ACCESS: {
						target: 'requestingMicAccess',
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
				entry: 'startRecording',
				after: {
					[MAX_DURATION]: {
						target: '#recorder.persistingRecording',
						actions: [],
						internal: false,
					},
				},
				on: {
					CANCEL_RECORDING: {
						target: 'idle',
						actions: 'cancelRecording',
					},
					STOP_RECORDING: {
						target: 'persistingRecording',
					},
					RECORDING_CHUNK: {
						actions: 'addRecordingChunk',
					},
				},
			},
			recorded: {
				on: {
					RETAKE_RECORDING: {
						target: 'recording',
					},
					SEND_RECORDING: {
						target: 'uploading',
					},
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
						target: 'idle',
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
			recordingError: {},
		},
		id: 'recorder',
	})
