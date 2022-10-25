import { createMachine } from 'xstate'

export const MAX_DURATION = 10000

export const recorderMachine =
	/** @xstate-layout N4IgpgJg5mDOIC5QCcwGMD2yJmQOgEsIAbMAYgCUBRARQFUqBlAFQH0BBAYU6cYG0ADAF1EoAA4ZYBAC4EMAO1EgAHogBMAZgAsWvBo0CAbIYCcW-RoCsADgA0IAJ6JLatXhtrD1gOxrvVkyMAXyD7VExsXDxUAEcAVzhZeSgAWQI0djQ0OFgyCAUwQnkANwwAa0LYhNhpNIysnMERJBAJKVkFJVUETR09A2MzCxt7JwRrNxNvQxt9LQEtQx0QsPQsHHwqxIJkuszs2FzcZCw8MWIAQ2kAMywAW2iweMS9hsOmpTaZOUUW7rUTJZvHgBFMtNYNCYoZ4fKNnAJrHhvJYtJZLF5fIETABGFYgcLrKIE7A7KBkTjsAByPAAMqxqJwAPIUAAiAElKQBxD4tL4dX6gf4mQzuNTgxYaCE4yFwhCWIx4LR+BGA8ECFyAvHEjaPCIQUlkFiMgAK9KoTNZHO5wk+km+nT+6mFovFhklkOxMsciHm2Pc1hMEO82MC1gDuNC+LWkU20f1yUo5uZ7K5rE4AAk6JSANI88R2-ldeF4AMzczB7ETNEaWUaYN6bELGyB0E+NRauNEuMG5Q1K6FC7XaS4AAUjYEE4AlGRtV29aS860Cz8iz1nS5Xe7pSZa1oTHhDKC62ofAG1MFI7PY3rIInmOxs1QzRaU9bmvn2ivHeNrCKQ35vGsRYTH0bxvFlVxEWxENsSBPxIWsaCOxva9CQgMg6GNGlGXYFln2TK1Fz5L9BUQbETzcBCtE9KYJg0NRaxDJEQMMc9JT8GFkMJVDInQzDsNw-DLS5PhsXfJdPwdUiEHIiY9EDajIUAzQGO9BB5n3MDqIWbxFiA3ouJjPA4nODALnjMl8nkQodlKCpjNM8yADECFIIjlyklQyN0jQQXBaDUQEGEtHAtTtDcSwrEQyxAzrPdDJ1EziDMiyyGOU5ziuW5kAeJKUpctybV5DyBS8mSfL8xDsUC4LQrGE9gTDajGyWDRDHItRLASqI8vMqhkBOZA7woABNdzJNK7pKzUP1rHRYNf0sRsNErCCrDwQI2olFbWumbr8F6iB+sG8kqVpVh+JwllxvtSb1AEbwBAPSFPGDSVAi0CC5PVeZ9E6iYgOxQx9rOXApBqUkKG7BMrJskpykKMQwYIGoofnZIbsLb9fxFB60XBHxIXouwwoEP0Qs9NEoXVVxtBBpHkHBpIoDR9YDXS-BMpue5QcZlHpFZkkMaKj9btXHGQWRFEw38ECT1leYnuRGYBElIE0RsEJI3kDAcHgFor0IEgwFtCbV1cQ88E6pbzFewxg0+tSXF8hEYV8fwYovVYUMeZ4Id2dJ9hyU2xe-f7EXFE8XHVHxAIVuarcPJSJi8cEQJB7VSRDrHpJChXkXcQF7cQnQAesDPOwgbOSLK6DoJBJb7fojXkTqxAVs0li2ImXwvBBw6s+Ks3v2qoE8GmyC9xW7EIMBZizHa-RjGMEKQdh6vPKmkC-W0AMJzddEETbhBwvcbQ91boKXBmfv5AuYoLlci4ACNSDqDe7pPkNEVMTrWLDUw1hVaynlPuTqqJ0RtixBGb23EHLJT6gNLAH9VwhhWnoNO+8rCHlhGpCi7gUSq2bgDaiwNLydk5sjf2LNoZQBQd+JalgNpgjJjMbEC1j5tTcIeBEiEHq6SAd4Cu6MoDHWQUPUO0lGxQmevbHBK1vCAksArMmVt0SRVMDFJYLgurkJ9tZSAsAaQYCgGyUqxFN5kSTgedUo8jCghMJ1eOwIyZFwovRaq+16HSQALQzzUj4phUIoTN3BJoSUiitZBCAA */
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
			needsLogIn: {},
		},
		id: 'recorder',
	})
