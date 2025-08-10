/**
 * Core types for the Skeuomorphic Answering Machine Web App
 */

export interface RecordingState {
  isRecording: boolean;
  recordingStartTime: number | null;
  recordingEndTime: number | null;
  audioBlob: Blob | null;
  hasPermission: boolean | null;
  errorMessage?: string | null;
  infoMessage?: string | null;
}

export interface AudioRecorderProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  onRecordingComplete: (blob: Blob) => void;
  isRecording: boolean;
  disabled?: boolean;
  maxDuration?: number;
}

export interface DropboxUploadConfig {
  accessToken: string;
  folderPath: string;
  filename: string;
}

export interface RecordingLimits {
  maxRecordings: number;
  maxDuration: number; // in seconds
  currentCount: number;
}

export interface AudioPermissionState {
  granted: boolean;
  denied: boolean;
  pending: boolean;
}

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface AnsweringMachineState {
  recording: RecordingState;
  limits: RecordingLimits;
  permissions: AudioPermissionState;
}
