import { createMachine } from 'xstate'

export const recorderMachineRenamed =
	/** @xstate-layout N4IgpgJg5mDOIC5QCcwGMD2yJmQOgEsIAbMAYgCUBRARQFUqBlAFQH0BBAYU6YG0AGALqJQABwywCAFwIYAdiJAAPRADYAHPzyr+-AEwB2AMwGArHoCM6gwBoQATzWmALHnWndATnXO9q1Z786gC+wXaomNi4eKgAjgCucDJyUACyBGjsaGhwsGQQ8mCEcgBuGADWRXGJsFLpmdm5AsJIIOKSMvKKKggWeiZ4phbORuqqpsYWqkZ6do4IE1p6fs6+6hYG4xOh4ehYOPjVSQQp9Vk5sHm4yFh4osQAhlIAZlgAtjFgCUlnjZfNina0lkClaPT6AyGIzGEyMUxmczUAUGFgspn8qlR-lWOxAEX20Xx2BOUDInHYADkeAAZVjUTgAeQoABEAJIUgDiANaQM6oNA4L8ejwFk8piM3kxhnMFkRCGcBi0nmcFjhgX6qmcAVxRIOn0iEBJZBYDIACnSqIyWeyuUJARJgV0wYgpp5VCLPIZRfwjOK4XKPK4JfwPJrllY-Dq9lFDtHDSlKJamWzOaxOAAJOgUgDS3LEDr53Rdzncg01znFBk8M19RjlJndmNR4om-k9vqjBsJccgieY7GzVAtVpTtpa+Y6IKLvTdeD0gV8mPUyvcBmccuW6hF3s1gSM5ZCYTxPdjXYgxqoFOZw+TNrzbQLU+dM-d8-4i6sK4m64ciBmFhFZZPCmEN1nGMZOwJfB4nuDAHnjUkCjkIoTjKSo8Bg4g4IgAAxAhSHvXknwFNRNG0XRDBMGVrHrYwRR9CUfGXZwglMSCYww2D4KNa5bnuJ5XmQD5MOwvCCLtHlHydEiEGWIw8E8T1w0U30DE0OtfwQEx5IsBjvBLZVWPYvURPgqhkBuZA+woABNQipP5ZQXVnN8P2Y1cf3mUxlUGCUW28-QVQsYzolMiBzMsslKRpVg6FNakGXYZl7MnaSnJfOcFz8T8S2-OVNXdcxdCsfRhnUUYQvwURcEkWoSQoOMjSQlDSgqIpquQWqpAag0SRSx1HPBAJ3VFL09z9WVNPUYVPE2DwjF0bEfWCo9dWiDquvqxqE14qrHhed47hqghah6-Y+okicBunZYqzcNUxk9KxVTlZxAjLfoDDRRUXD0HFcTkDAcHgVo1vwIhSHtVLBsQcUlUMN1ZtVTYVXyhU8H0YrNEsEsTEqz5vjq04MnOXIoeu58xi3QJUX0MZVlY-K4TwX1vN9IJjGA1R8d1ElycLZ8yoA-wqx8fovFMV6yOXTVhhDPR3x9HmewgfniPSzE501fdLH4MwSvUetdJZgxTbFCsfVMIZ8bCvnJOh6cWM8PBjBGFHa0t+s3vI6t+CbT1-GGfHmrVtKeiphT+FpvR6ZY9xaJ00rpnfNSo7+m25AeEoHnwh4ACNSHqUOYd6EthdUUXfAW-gxXyxUMebDEsXLG2uPCiysGLx3Zk06ZTBdtdlzXVUK6MfGNpO5IoDO4kUi7wXPWdsxRjeowFXcVZXorjGNAV6a4T+mZld6lIIs7+2KZkvQhi0cqKyH7y+k8V7gJ3z7vpDXx-t2LtkHnmSAC0qg5RANCKEIAA */
	createMachine({
		context: { micRecorder: undefined, recordingBlob: undefined },
		preserveActionOrder: true,
		predictableActionArguments: true,
		initial: 'idle',
		states: {
			idle: {
				on: {
					REQUEST_ACCES: {
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
