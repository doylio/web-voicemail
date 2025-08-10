"use client";

/**
 * Custom hook for managing audio recording state and operations
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

import { getMaxRecordingDurationSeconds } from "@/lib/recordingLimits";

interface UseAudioRecorderReturn {
  startRecordingTime: number | null;
  error: string | null;
  info: string | null;
  isRecording: boolean;
  startRecording: () => void;
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
  const maxDurationMs = maxDurationSeconds * 1000;

  const [info, setInfo] = useState<string | null>(null);

  const [startRecordingTime, setStartRecordingTime] = useState<number | null>(
    null
  );
  const durationTimerRef = useRef<number | null>(null);

  const [isRecordingEarly, setIsRecordingEarly] = useState(false);

  const mediaRecorder = useReactMediaRecorder({
    audio: true,
    blobPropertyBag: { type: "audio/webm" },
    onStop: (blobUrl, blob) => {
      downloadRecording(blobUrl, blob);
      setIsRecordingEarly(false);
      if (durationTimerRef.current !== null) {
        window.clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
        setStartRecordingTime(null);
      }
    },
    onStart: () => {
      setStartRecordingTime(Date.now());
    },
  });

  useEffect(() => {
    if (startRecordingTime && durationTimerRef.current === null) {
      durationTimerRef.current = window.setInterval(() => {
        if (!startRecordingTime) return;
        const now = Date.now();
        const duration = now - startRecordingTime;
        if (duration >= maxDurationMs) {
          // Auto-stop when reaching the max duration
          try {
            if (mediaRecorder.status === "recording") {
              console.log("Stopping recording", duration, maxDurationMs);
              mediaRecorder.stopRecording();
              setInfo("Message length limit reached");
            }
          } catch {
            // Ignore stop errors; onstop handler will manage state regardless
          }
        }
      }, 1000);
    }
  }, [startRecordingTime, maxDurationMs, mediaRecorder, setInfo]);

  useEffect(() => {
    if (mediaRecorder.error) {
      setIsRecordingEarly(false);
    }
  }, [mediaRecorder.error]);

  const downloadRecording = useCallback((blobUrl: string, blob: Blob): void => {
    try {
      const filename = makeFilename(blob.type || "audio/webm");
      const url = blobUrl || URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      // Revoke object URL shortly after to free memory (if we created one)
      if (!blobUrl) {
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch {
      // Fallback: surface a user-readable error without leaking internal details
      setInfo("Failed to download recording");
    }
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

  const startRecording = useCallback(() => {
    setIsRecordingEarly(true);
    mediaRecorder.startRecording();
  }, [mediaRecorder, setIsRecordingEarly]);

  return {
    startRecordingTime,
    error: mediaRecorder.error,
    info,
    isRecording: isRecordingEarly || mediaRecorder.status === "recording",
    startRecording,
    stopRecording: mediaRecorder.stopRecording,
  };
}
