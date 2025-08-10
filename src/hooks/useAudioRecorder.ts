/**
 * Custom hook for managing audio recording state and operations
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { getMaxRecordingDurationSeconds } from "@/lib/recordingLimits";
import { RecordingState } from "@/types";

interface UseAudioRecorderReturn {
  recordingState: RecordingState;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}

/**
 * Custom hook for managing audio recording state and operations
 *
 * @returns Object containing recording state and control functions
 *
 * @example
 * ```typescript
 * const { recordingState, startRecording, stopRecording } = useAudioRecorder();
 * ```
 */
export function useAudioRecorder(): UseAudioRecorderReturn {
  const maxDurationSeconds = getMaxRecordingDurationSeconds();

  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    recordingStartTime: null,
    recordingEndTime: null,
    audioBlob: null,
    hasPermission: null,
    errorMessage: null,
    infoMessage: null,
  });

  // Refs to manage recorder lifecycle without causing re-renders
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const durationTimerRef = useRef<number | null>(null);

  const stopDurationTimer = useCallback((): void => {
    if (durationTimerRef.current !== null) {
      window.clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
  }, []);

  const cleanupStream = useCallback((): void => {
    const stream = mediaStreamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    mediaStreamRef.current = null;
  }, []);

  const pickSupportedMimeType = useCallback((): string | undefined => {
    if (typeof window === "undefined" || !("MediaRecorder" in window)) {
      return undefined;
    }
    const candidates: string[] = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/ogg",
    ];
    for (const candidate of candidates) {
      if (
        window.MediaRecorder &&
        window.MediaRecorder.isTypeSupported(candidate)
      ) {
        return candidate;
      }
    }
    return undefined;
  }, []);

  const makeFilename = (mimeType: string): string => {
    const pad = (n: number): string => String(n).padStart(2, "0");
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    let ext = "webm";
    const lower = mimeType.toLowerCase();
    if (lower.includes("webm")) ext = "webm";
    else if (lower.includes("ogg")) ext = "ogg";
    else if (lower.includes("wav")) ext = "wav";
    else if (lower.includes("mp3") || lower.includes("mpeg")) ext = "mp3";
    return `message-${yyyy}-${mm}-${dd}_${hh}-${min}-${ss}.${ext}`;
  };

  const startDurationTimer = useCallback((): void => {
    stopDurationTimer();
    durationTimerRef.current = window.setInterval(() => {
      if (!recordingState.recordingStartTime) return;
      const now = Date.now();
      const duration = now - recordingState.recordingStartTime;
      if (duration >= maxDurationSeconds) {
        // Auto-stop when reaching the max duration
        try {
          if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state === "recording"
          ) {
            mediaRecorderRef.current.stop();
          }
        } catch {
          // Ignore stop errors; onstop handler will manage state regardless
        }
      }
    }, 1000);
  }, [
    maxDurationSeconds,
    recordingState.recordingStartTime,
    stopDurationTimer,
  ]);

  const startRecording = useCallback(async (): Promise<void> => {
    console.log("startRecording", recordingState.isRecording);
    if (recordingState.isRecording) {
      return;
    }

    try {
      if (typeof window === "undefined") {
        throw new Error("Recording is only available in the browser");
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "MediaDevices.getUserMedia is not supported by this browser"
        );
      }
      if (!window.MediaRecorder) {
        throw new Error("MediaRecorder API is not supported by this browser");
      }
      console.log(1);

      // Request microphone access (this both checks and prompts as needed)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
      console.log(2);
      mediaStreamRef.current = stream;

      const mimeType = pickSupportedMimeType();
      const recorderOptions: MediaRecorderOptions = mimeType
        ? { mimeType }
        : {};
      const recorder = new MediaRecorder(stream, recorderOptions);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      console.log(3);
      recorder.ondataavailable = (event: BlobEvent): void => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      console.log(4);
      recorder.onstop = (): void => {
        stopDurationTimer();
        const blob = new Blob(chunksRef.current, {
          type: mimeType ?? "audio/webm",
        });
        chunksRef.current = [];

        // Update state with final blob and duration
        setRecordingState((prev) => ({
          ...prev,
          isRecording: false,
          recordingEndTime: Date.now(),
          audioBlob: blob,
          infoMessage: "Recording complete",
          errorMessage: null,
        }));

        // Download the recording immediately
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = makeFilename(blob.type || (mimeType ?? "audio/webm"));
        // Some browsers require the element to be in the DOM
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);

        // Clean up stream resources
        cleanupStream();
        mediaRecorderRef.current = null;
      };

      console.log("setting recordingStartTime", Date.now());
      // Start recording
      setRecordingState((prev) => ({
        ...prev,
        recordingStartTime: Date.now(),
        isRecording: true,
        hasPermission: true,
        duration: 0,
        infoMessage: "Recording…",
        errorMessage: null,
      }));

      recorder.start();
      startDurationTimer();
    } catch (error) {
      console.error("Failed to start recording", error);
      let message = "Failed to start recording";
      // Narrow common browser error names
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError") {
          message = "Microphone permission denied";
        } else if (error.name === "NotFoundError") {
          message = "No microphone found";
        } else if (error.name === "NotReadableError") {
          message = "Microphone is already in use";
        }
      }

      setRecordingState((prev) => ({
        ...prev,
        hasPermission: false,
        isRecording: false,
        errorMessage: message,
        infoMessage: null,
      }));

      // Ensure we clean up any partial stream if something failed after getUserMedia
      cleanupStream();
      mediaRecorderRef.current = null;
      chunksRef.current = [];
      stopDurationTimer();
    }
  }, [
    cleanupStream,
    pickSupportedMimeType,
    recordingState.isRecording,
    startDurationTimer,
    stopDurationTimer,
  ]);

  const stopRecording = useCallback((): void => {
    try {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        // Set recording false immediately for UI responsiveness; final blob set in onstop
        setRecordingState((prev) => ({ ...prev, isRecording: false }));
        mediaRecorderRef.current.stop();
      }
    } catch (error) {
      void error; // mark as used to satisfy no-unused-vars
      // Surface error but keep app stable
      setRecordingState((prev) => ({
        ...prev,
        errorMessage: "Failed to stop recording",
      }));
    }
  }, []);

  // Cleanup on unmount to avoid dangling media tracks or timers
  useEffect(() => {
    const effectCleanup = (): void => {
      try {
        if (
          mediaRecorderRef.current &&
          mediaRecorderRef.current.state === "recording"
        ) {
          mediaRecorderRef.current.stop();
        }
      } catch {
        // ignore
      }
      stopDurationTimer();
      cleanupStream();
    };
    return effectCleanup;
  }, [cleanupStream, stopDurationTimer]);

  return {
    recordingState,
    startRecording,
    stopRecording,
  };
}
