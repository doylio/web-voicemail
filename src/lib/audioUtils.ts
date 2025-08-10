/**
 * Utility functions for audio processing and recording
 */

/**
 * Checks if the browser supports the required audio recording features
 */
export function checkAudioSupport(): { supported: boolean; reason?: string } {
  if (!navigator.mediaDevices?.getUserMedia) {
    return { supported: false, reason: "MediaDevices API not supported" };
  }

  if (!window.MediaRecorder) {
    return { supported: false, reason: "MediaRecorder API not supported" };
  }

  return { supported: true };
}

/**
 * Formats duration in seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

/**
 * Calculates recording duration between two timestamps
 */
export function calculateRecordingDuration(
  startTime: number,
  endTime: number
): number {
  return Math.floor((endTime - startTime) / 1000);
}

/**
 * Gets optimal audio constraints for voice recording
 */
export function getAudioConstraints(): MediaStreamConstraints {
  return {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100,
    },
  };
}
