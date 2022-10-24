import { createMachine } from 'xstate'

export const recorderMachine =
	/** @xstate-layout N4IgpgJg5mDOIC5QCcwGMD2yJmQOgEsIAbMAYgCUBRARQFUqBlAFQH0BBAYU6cYG0ADAF1EoAA4ZYBAC4EMAO1EgAHogCMADgDseAQCYAbAIAsxgMwBWPReMBOAwYA0IAJ6JtOjcYN61A22YCWlrGAL6hzqiY2LiEJOSMdABCALIAkmwAYmkAMlSCIkggElKyCkqqCJo6+kamltZ2Ds5uCIa2eKZ6Jnq2thoCVmZm4ZHoWDj4qACOAK5wsvJQKQRo7GhocLBkEApghPIAbhgA1vsz87DSK2sbWwVKJTJyikWVWgYdAhrDehoWai0Fg0PxaiC0tj0eEBQI0tmMvT+BjUoxAUQmsQuCwISxu602sG2uGQWDwYmIAENpAAzLAAWzwWKueLuhIeRSeZVeoHen10PzMfwBsNBrnckLwFiCn1MAgMGj+WlR6JiU3G2BxUDInHYADkeDlWNROAB5CgAETSuoA4uzxJJnuU3uCAngPuYunpAvCzGCEJ8oXC9N5AWoDFozMYNMr1ZNGbHNWQWCaAApGqimi1W23CR4OrkVdRenQfMNqYzfMx9CwWP0DDSS4ZyyHfHwaAwx6JxlUQRPGs2Wm2sTgACTouoA0nbivmXoWqvodGphoKLD4K3oI375QI3RYzANAsErAYRhE0bHMZeIJQqMx2BOqOnM4Oc4V7aU586qtpdIYTOYVg2PYThiggFhaGonT6MGcpegC5idhiapdpASZULq5rPgO2bTpyX48uov61ABDTAc0YG+DoIYGAivi2BYtgmGeYyofgszkhgFK9ksOx7AcxxnHgHHEFxECZAQpB4bOTqEQgHxfAKQqAsCoqtKYHS2Go3RGAECoRiYSGqsJnHcYmxKkuSVK0sgDIiWJElSbmHIydyKjgnylaCv8Kkgr6lFrp0xhaL4vRhtoyJGXG9ncVQyAksgt7MBQACa0mfrJ7kIExZhuqYwRAkYgwKn63TGJ0DgaNpy5eOWmhRbEMUQHFCXanqBqsHQKY5Ca7DmuljpuZUCq5T4fi0Zu1iAv5rRVjoARqBBxiLe2XrRuePaxGIuBSFcmoUAmvG7PI+w4oJ+zbcgu3SAdXaagNBbftpZglsiyIVj81a1mBCp4LYHxrtoUbAgxHYbZe+CXdd+2HVqFmQ5SNL0mSO0EFct0TPdzkfoN86aL40HfO2THGDWp5+hC5VaCY8IOJBeiGGD57yBgODwEUm34EQpB5hlQ3gvNUpSgEtHAvUFNqFBNjhsMQsM-4DVqnM2K4qs+JbLzuPfhWu7BQIcGbv9lN1jYeANEEQQKsGDiK-Gd1LJrj1yX4Xp4F6nxHsu3QQRT-y6AeARBExQQfLbm0QI7BFZQipWLRVZYCGY4a9CCei201mqR5llSkwY0KaAhp7-N0tilYEnT7v4Uq0QxLEXmxeDHWAWf8wurvu4HkGCoMWh+hpf1+CEIKfN8m5hODDezPIFKHBSkkUgARqQNwt3j+i5R3nvdz7P2uvrHwhZLMHeOnpnNfFWCr0969u0nndez3foHku7ak9bL2SxYttQ2jixQBjGoHYuT5njYKUFBSbhCJ3LwxgKaQTdn4Kqy59Y2DMCiCeyE7aYyWC1S+wCtZyW9lCCskYAhoJCvrUCrQIQWDdjTSwVhESk0VlfOSABaKhiA2G0L6LwgQi1AjAkGOEcIQA */
	createMachine({
		context: {
			micRecorder: undefined,
			recordingBlob: undefined,
		},
		preserveActionOrder: true,
		predictableActionArguments: true,
		initial: 'idle',
		states: {
			idle: {
				on: {
					REQUEST_ACCESS: {
						target: 'requestingMicAccess',
					},
					SUBMIT_FILE: {
						target: 'uploading',
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
