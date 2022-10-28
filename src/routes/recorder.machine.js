import { createMachine } from 'xstate'

// 15s (in ms)
export const MAX_DURATION = 15000

export const recorderMachine =
	/** @xstate-layout N4IgpgJg5mDOIC5QCcwGMD2yJmQOgDsBDAWzADEsS8ALI2AOTAHcAJIgiAGzAGIAPWABciQsHiIAzMcgAUAVgAMigJS9UmbLkKkKVWvSZsO3MAG1FAXUSgADhlgBLIY4wEbIfogAc3xXgBmZXkAJkVvAIBGeT8AgBoQAE9EABYQlLx0gHYAThzFUIA2EMiQ7wBfcoSNLBx8YjJKZGoAN1xHSUTHAih2Th5eCDdxbpaMAGtxNuQOxL7TC2skEHsnFzcPLwRIgJCQvByArJKQrOO9kITkhADCgLwUgMfCrPlbqKfK6vRa7Qa9Zp4aazbq9EwDXDILB4WxcUSSfTAzrzHiLDyrZyudzLLY7PYHI4nM4XS5JVIhe4pSIpQryLKRHJlXJvL4gGpaeq6JokXgAJQAogBFACq-IAygAVAD6AEEAMJy8VitHLDHrbGgLaMq6ISKRO54PVKY4vLLKW6s9l1HSNKi8ACyAHkACIASXIAE0pQwZfb+Sq7A5MRscbrIvS8IpIopbspFClfPIdQh5DlInhvIU8d4cvI3rdCpafhybQCeU63Z6pawZQxnQAZf1WdFB9WbRBvfx5V65tPRJ7xMkIFLKPCpunxw65mKFqps4vW1AARwArnAXD17Y40DK0Gg4LBBsM8KMJuJl2vhFud3uDwGVq2se3tqTrqUi5pF2BV+vQdfd-usCHpC0KwvC+gXuu-63kB95qk+oYpq+uo5hkoTeCkuS0lktzeFkH6-PgVqgrwcq1oq9ZSgKcqOryboMAA4nBj4hpqiCnOmoQJpmWRUomkTJiEeYPJ2OSFLmeoMjhBElsRPS8JKjoAApUfyNF0a6jHMWsCFsQgZScekvgvHx3jyAJQ44d4hoBFx0YhOJ8izt8n7aHJUACMIojiFIMiyNEcZqFabkLqC2nBhqnjsd4hncSZkT8cmhSZoa8gJrsOS+AUdIyV+rkQHy-ISjKADS-Kqep9FMc2qosZFWzeMhL4YXghQFCUdy+Jhey5SF+W8MKSn1o6MrOhVtFVeFbaISU+oZkEAS3A5fgxVkyZOfcER6sSoSHFkFRzsFRELpAA1DSNY3URNmlMZESyBjprFRfpeqFPNMZLcl4Thkl0QZkaZkhGmEQxb1+ArrCGBEBAJFDAQIwEGMkx4BDXBQxA5COKiNUPRFz62fsmapo8i1nPtYnJtSihvYoYlZC8tl5AyARgyjkPQyRIH4GBQgIoCqPo5j2P3Q+j31YgS0ZrSOQk0cZw5oUlPmf4BSvBEjzEqzAvQ-yyBQsghUSryHpTbpz2S0TMuLXL5OK0O1IxJGZzhm8mUxTk+GHSd4PsxAuv66R5H8pRg3DaNptPVsyVZBmmWPJhMthHqSvxpkpx3AEMW2fSISs7YuBOMIoK8qF8lwwjSPiPnyCF0IJefmFOOi3jiEu-c6QfBSTx0t462NYahSPAlUTUj1XuudzBeOEXPT17UnN66BcK8-o1e13P2CNyL8GRz4ZSZGrJR+OZ0R29cOEx0EYQOYoPY5ePhF4O5-tYIbpXlVdGlaU3O-i0hlN3E4gnemjVQi01nHOAgGAcDwGWEdUs3ITymBbGLZ8dIch4BwqUW+1I-CKDKOtWmGY-CMlpvqZ4rN-iILoIwFgKIwAoJbnpekMc0oxmplmdOERkxpAyLxXI+QignAOi5R+VDETtE6KCehjDpp6Xsm9PUaQojJTuGlQc1xM7yEyKmHYuZCi0iCE5ShXJ9B0H6GAGULQiBYyIAAIx4LIs2uIiiRmSjEN4I56ZnwlgaQ4zxXjvB2CkExtpATmNMMKYg1jbEOIYbVVBrdXHUzMmZJ4t8DE8IpAcakZw8yvBKEceQoSyxON3sOfu3Zxx9k8Ro9ivERL7QZNTW+bw0qs0gjPKA0FAKwNxnI56vhWHUh2IPMZqZe72wcvcLMeplDiQTPGDppcoBlL-mkJKeEdHZVdikTK+Dln5TWc+BkKU-BpGSphcMaYUhJWpoEfUbVHkpBedJB+JZtYwx6McxCZxKY0nuLsHYtk-D7TSrnd51py4-L0mldMzyMJlEWmZHI-z7m0zSqC6I+QQmQu0CuaJNi4RxOvDC56QN7jjnajhfIQkkz2xzNo-BKLYgexjFrX2L9kBkq2Ji1q30SjKMTJMt8Sg+Hp2RTsOk748WTxrtPDcUAN5fNWQkphz1MLWVOSM0ojVqZ1IQOJDB1JaQvMOHsakhz549C5Ty3UBQMGnBiqULMOZ6a3MskcDM+D8FtTvp7URJZ4aQFgPWDAUBXSRV-s+F4SsIxOVeNHTMQRDhgztQgAAtLcZMGb6YHHppizCeZUz7UqJUIAA */
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
