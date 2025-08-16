"use client";

/**
 * Custom hook for managing audio recording state and operations
 */

/// <reference path="../types/mic-recorder-to-mp3.d.ts" />
import MicRecorder from "mic-recorder-to-mp3";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useLocalStorage from "use-local-storage";

import { uploadRecordingToDropbox } from "@/lib/dropboxUtils";
import { getMaxRecordingDurationSeconds } from "@/lib/recordingLimits";

interface UseAudioRecorderReturn {
  startRecordingTime: number | null;
  error: string | null;
  info: string | null;
  isRecording: boolean;
  isUploading: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  hitMaxDuration: boolean;
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
  const maxDurationMs = maxDurationSeconds * 1000;

  const maxRecordingsString = process.env.NEXT_PUBLIC_MAX_RECORDINGS;
  const maxRecordings = maxRecordingsString ? Number(maxRecordingsString) : 10;

  const [info, setInfo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hitMaxDuration, setHitMaxDuration] = useState(false);

  const makeFilename = useCallback((mimeType: string): string => {
    const pad = (n: number): string => String(n).padStart(2, "0");
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    const ss = pad(d.getSeconds());
    let ext = "mp3"; // Default to mp3 since mic-recorder-to-mp3 outputs MP3
    const lower = mimeType.toLowerCase();
    if (lower.includes("mp3") || lower.includes("mpeg")) ext = "mp3";
    else if (lower.includes("webm")) ext = "webm";
    else if (lower.includes("ogg")) ext = "ogg";
    else if (lower.includes("wav")) ext = "wav";
    return `message-${yyyy}-${mm}-${dd}_${hh}-${min}-${ss}.${ext}`;
  }, []);

  const [uploadCount, setUploadCount] = useLocalStorage("uploadCount", 0);
  const uploadRecording = useCallback(
    async (blob: Blob): Promise<void> => {
      try {
        setIsUploading(true);
        setInfo("Saving your message...");

        const filename = makeFilename(blob.type || "audio/mp3");
        const dropboxPath = await uploadRecordingToDropbox(blob, filename);

        setInfo(null);
        setTimeout(() => setInfo("Thanks for your message!"), 100);
        setUploadCount(uploadCount + 1);
        console.log(`Recording uploaded to: ${dropboxPath}`);
      } catch (error) {
        console.error("Upload failed:", error);
        setInfo("Failed to save your message. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [makeFilename, uploadCount, setUploadCount]
  );

  const recorder = useMemo(() => {
    return new MicRecorder({
      bitRate: 128,
    });
  }, []);

  useEffect(() => {
    return (): void => {
      if (recorder && isRecording) {
        try {
          recorder.stop();
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, [isRecording, recorder]);

  const [startRecordingTime, setStartRecordingTime] = useState<number | null>(
    null
  );
  const durationTimerRef = useRef<number | null>(null);

  const startRecording = useCallback(async (): Promise<void> => {
    if (!recorder) return;

    if (uploadCount >= maxRecordings) {
      setError("You've reached the maximum number of recordings.");
      return;
    }

    try {
      setInfo(null);
      setError(null);
      setIsRecording(true);
      setStartRecordingTime(Date.now());
      setHitMaxDuration(false);

      await recorder.start();
      console.log("Recording started");
    } catch (err) {
      console.error("Error starting recording:", err);
      setError(
        "Failed to start recording. Please check microphone permissions."
      );
      setIsRecording(false);
      setStartRecordingTime(null);
    }
  }, [recorder]);

  const stopRecording = useCallback(async (): Promise<void> => {
    if (!isRecording) return;

    try {
      const [_buffer, blob] = await recorder.stop().getMp3();
      setIsRecording(false);
      setStartRecordingTime(null);

      if (durationTimerRef.current !== null) {
        window.clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }

      // Upload the recording
      await uploadRecording(blob);

      console.log("Recording stopped and processed");
    } catch (err) {
      console.error("Error stopping recording:", err);
      setError("Failed to process recording. Please try again.");
    }
  }, [isRecording, uploadRecording, recorder]);

  // Auto-stop timer effect
  useEffect(() => {
    if (startRecordingTime && durationTimerRef.current === null) {
      durationTimerRef.current = window.setInterval(() => {
        if (!startRecordingTime) return;
        const now = Date.now();
        const duration = now - startRecordingTime;
        if (duration >= maxDurationMs) {
          // Auto-stop when reaching the max duration
          try {
            if (isRecording) {
              setHitMaxDuration(true);
              stopRecording();
            }
          } catch {
            // Ignore stop errors
          }
        }
      }, 1000);
    }
  }, [startRecordingTime, maxDurationMs, isRecording, stopRecording]);

  return {
    startRecordingTime,
    error,
    info,
    isRecording,
    isUploading,
    hitMaxDuration,
    startRecording,
    stopRecording,
  };
}
