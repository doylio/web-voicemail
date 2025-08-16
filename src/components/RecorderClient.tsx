"use client";

import React from "react";

import { AnsweringMachine } from "@/components/AnsweringMachine";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";

export default function RecorderClient(): React.JSX.Element {
  const {
    isRecording,
    startRecording,
    stopRecording,
    startRecordingTime,
    error,
    info,
    hitMaxDuration,
  } = useAudioRecorder();

  return (
    <AnsweringMachine
      isRecording={isRecording}
      onRecord={startRecording}
      onStop={stopRecording}
      startRecordingTime={startRecordingTime}
      error={error}
      info={info}
      hitMaxDuration={hitMaxDuration}
    />
  );
}
