"use client";
import React from "react";

import { AnsweringMachine } from "@/components/AnsweringMachine";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";

export default function Home(): React.JSX.Element {
  const { recordingState, startRecording, stopRecording } = useAudioRecorder();
  const isRecording = recordingState.isRecording;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200">
      <main className="w-full max-w-4xl">
        <AnsweringMachine
          isRecording={isRecording}
          onRecord={startRecording}
          onStop={stopRecording}
        />
      </main>
    </div>
  );
}
