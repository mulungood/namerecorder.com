import { createMachine } from 'xstate'

export const MAX_DURATION = 10000

export const recorderMachine =
	/** @xstate-layout N4IgpgJg5mDOIC5QCcwGMD2yJmQOgDsBDAWzADEsS8BLCAGzAGIBZAeQBEBJcgTQH0AEgEEAchwAyAUQDaABgC6iUAAcMsGgBcaGAspAAPRAHYAnKbwBGAEwAOW6dsBmY3IBsl49YA0IAJ6IlgCsThZuQY5ynk5BQZYAvvG+qJjYuISkFFR4ABZEsKJgAO6CRAQMzOzcfEJikrKK+moa2rr6RgjmcnhuxpbObtYALJ5utj7+gSHWeMa2bkN2ptZBHglJIClYOPjEZJTI1HkFxaXljEwGsJpEmmB4RABmd8gAFJZyn3IAlExbabtMgcjvlCiUyhV5EokCBmlodHoYQEEJY3L1ZtZPsYRn0nPZjL4OpZgsYrE5LENTB4gnI+lTEsl0Nt0nssoc8AA3XA0R5+GgEKBnCpMCC6e78jkYADW9y5yB5fiFjChTXU8LaMI6Qzktjw42sxicvQWESGQSGvmRnnGPW11nCphsDk8DM2TIBGX22TlCv5gohF1wyCweBU9Fuj293N5SrAKphcNaiNAWp1eusBqNxhNpjNFsmKNsix6mL6licTiGc2MQVd-x2nrZ1B9vL9sdYnB4AhE4mk8dUaqT7UQ2t1+sNxrNufNlsCaMsVhpcgr40Wn1sdfdDdZwNyAbAwg5RBo4YARhcql3ar2GtCBy0EcOEGYLE6HM5XB4vLOUXMZgs5HtCInUdYxN1SbcgWyPJzjAABVYgjxPIhz0qTsah7ep+1hQdH01ExzCsOx3xcdxPAmK0i3-UsnE+UxAMNDcNnrFkoMOJgACUpAARTgqQAGUABV+GEABhUSBP47DEzwlNAmGboQmWeY3ArYYCQLTwhjcPBaJWIJXAiR1+nA5lAS9djLxqURhBYW9VQfDVQCtI1ukAxwbHJStc1MQlAicTE8GsCljKpVYKTcUyPR3KgO2qbs6j7RoE1wpzDH8wLgspYkwo8bSf3LGw8Hc2xPPLSlKSihtUAARwAVzgbQBRYGg0GENA0DgWARTFWgCElGU8FqhrrhatqOq66TUuTdLnwoxBbDkIIejkMKoiGIYYjcUwqvSYbGr9Mb2s62BuqDEMwwjbJ9tG1rjsm5L73VGaiXfPARkdVc3CW0I3AKiJSQC3pxgrbSRmsXb8HrP0mFEsQJIkfguNEtgOO4UQAHEpscl7EHtHSgnUgKK1MSt3B-bSZgCs1VrIj9nEhoatxhoS2AABSRqQUbRrhMex56nwNAmiesEmyb+gsYlJIZbC8RZNplvpVMZ6GBU4rnUfRjH+FEwQ4NEABpfmh3wlEogJlTRdCZTzAKrwMWxNFto+TaVeZtWrhuO4HmeXB3i+H4-i3Pb3agY3ZNmoW8EJqtidCcWf1o5aaV6IJFtcGsIlrZjg6h4OIHVwThANqROe5rXw7Sjp8ejkWxe1CXKKGYrUTiNP7G2-U3YgyAmDgtmJDYYQODLzXeaxx6cJxp9BgKz4F0NO1VKLcY5m75kC-7wfh9Hnm+csO8p4F03Cbn2xltceZy2sRxTGxJjGR7-A6rDDAiAgGHRQIcV+ule4X-oG-CA5ATxxknjJKuiBejdA2iMM0oRRY2EsD+HyswQjmkxKWGwEMc5PzwAAoBMNzr4EupoSM7ICHvxAcqcB00Z6uHehtCkSlEHBTPhfHUHgAq33vozShEApDIGDMgQuHFeCV1xggaBjC4EsPJGwzS89Zhk3tHiGWBoH5ujwfwwRwjYbwykIjLeQ8OASKfOYZaVZgZXw2vaWwc8zB6jmNMAyqIMzrEfmZUMuANDXD9BxUOPVv59QGvcFQPiaDXACRBP0ZjTYgyCjWcwNYzDOAzD+FYgMxheAYv0VYmiWIkIiX4gU0TthEKERdcMZDsjhOQL4zQZTsCxNodPeJotElGRSY4AK80EBbR6EpfJisojrA2AQDAOB4AwkKY2XcdBGAOWPnJZ8wRiohDNAZHJdg+nBG1IuDyURMmLWzp46KbEQQnHBLBJZJsVkfE+MVVSxJjCuAzBWJwBU0SkhybSHE5Z8SMxiuyFsfIBSxluRHDossCpried9ACMtz53yBRcvcsFDzHjPIslKbSVkeF1Jfc+L5tLn0boEOYTgrBL2AksF0uCvHApBLBBCRAkLYrAJCyBUjiR4FMOaPEqJsyDCCAVIsVKbC0lorTTMBTc5zKoFyyRoQCoVgXDqflWI74bUcG7eqB1mp3QmqdJVT5gg3z1EtflwxZYfApP9Q0eogYBWXNiKsOCznVVDqa02VYMmvJbvaWkrytpaXXmkCAPr7lLR0h+VEqJSqDGXP65azsoirBpPMeYfDX7vz9FG2aoRm4GVKuWQY2kSb5mRHfXUotHDZh1NmFcjMv6ctxcs2a59CU6uCs4RamJfIFlQTWDMmIxjhQWHwxCWKUKMDGgW6uFI3IRSlTWZc5KUQA3TMDK2YMbA5sAe-XRWAF0LVWFYeYZoVgeDRI6M+3QXDnwCq4wYwVGZ1Iaf4717a7mzVjlYGtqk04fSLInfo71HA3zBlOLM4aP4CmPcgU9ZtzSJPPutVEX5RWSwMouUIq07UhCLECsAkBYASAwFALgM0IHKrmHyisaImHpwWJ8xR8wgqcI8HIbS5ZsSQ2QwAWkHciZwaDaaVl+hWJaiREhAA */
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
						actions: 'assignHandle',
						target: '#recorder.nameForm.hasNewHandle',
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
						target: 'nameForm',
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
						target: 'nameForm',
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
