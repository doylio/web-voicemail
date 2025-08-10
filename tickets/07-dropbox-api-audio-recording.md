# Ticket #7: Microphone Recording & Permission Handling

## Description

Implement browser-based microphone recording using the HTML5 MediaRecorder API. Recording should begin from the Record button in `src/components/AnsweringMachine.tsx` after requesting microphone permissions, and stop when the user presses Stop or when a configurable time limit is reached. Show clear user feedback for permission prompts, errors, and when the time limit triggers an automatic stop.

## Priority

High - Core functionality

## Dependencies

- Ticket #1: Project Setup (dependencies needed)
- Ticket #4: Recording Controls UI (Record/Stop buttons in `AnsweringMachine.tsx`)

## Acceptance Criteria

- [ ] Clicking the Record button in `src/components/AnsweringMachine.tsx` requests microphone access via `navigator.mediaDevices.getUserMedia({ audio: true })` if permission has not yet been granted.
- [ ] If permission is granted, recording starts using the MediaRecorder API (audio-only) and the UI reflects the recording state (`isRecording = true`).
- [ ] If permission is denied or an error occurs (e.g., insecure context, device unavailable, unsupported browser), a user-friendly error message is shown and recording does not start. The app state records `hasPermission = false` in this case.
- [ ] The Stop button stops the recording immediately, finalizes the audio Blob, and updates state so the audio is available for subsequent features (e.g., playback or upload in future tickets).
- [ ] A configurable maximum duration limit is enforced (found in environment variable). Recording stops automatically once the limit is reached.
- [ ] When the maximum duration is reached, the user is clearly informed that the limit was reached (e.g., inline message or toast), and the recording is finalized.
- [ ] While recording, basic duration tracking is maintained in state (e.g., seconds elapsed) to support simple UI feedback.
- [ ] The Record button is disabled while recording is active, and the Stop button is enabled only during recording.
- [ ] Works on modern browsers (Chrome, Firefox, Safari, Edge). Safari-specific constraints are handled (e.g., secure context requirement). When unsupported, an informative message is displayed.

## Technical Notes

- Use `MediaRecorder` for capture and `getUserMedia` for permissions; store resulting audio as a Blob in state.
- Ensure implementation handles: permission denied, insecure context (non-HTTPS), device-not-found, and MediaRecorder unsupported.
- Maintain recording state in the existing `useAudioRecorder` hook (`recordingState`, `startRecording`, `stopRecording`).
- Track duration in state with a timer that resets on stop.

## Definition of Done

- Recording starts from the Record button after permission is granted and stops via Stop or on hitting the time limit.
- The user is notified when the time limit stops the recording.
- Permission and runtime errors are handled gracefully with clear messages; the app does not crash.
- State reflects permission status, recording status, duration, and captured audio Blob.
- Behavior verified manually on latest Chrome, Firefox, Safari, and Edge.
