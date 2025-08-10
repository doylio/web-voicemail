/**
 * A skeuomorphic record button that mimics a physical answering machine button
 */

import React from "react";

import { AudioRecorderProps } from "@/types";

interface RecordingButtonProps
  extends Pick<
    AudioRecorderProps,
    "onStartRecording" | "onStopRecording" | "isRecording" | "disabled"
  > {
  className?: string;
}

const BUTTON_ANIMATION_DURATION = 300;

export const RecordingButton: React.FC<RecordingButtonProps> = ({
  onStartRecording,
  onStopRecording,
  isRecording,
  disabled = false,
  className = "",
}) => {
  const handleClick = (): void => {
    if (disabled) return;

    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`recording-button ${isRecording ? "recording" : ""} ${className}`}
      style={{
        transition: `all ${BUTTON_ANIMATION_DURATION}ms ease`,
      }}
    >
      {isRecording ? "Stop Recording" : "Start Recording"}
    </button>
  );
};
