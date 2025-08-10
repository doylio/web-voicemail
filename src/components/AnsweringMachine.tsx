"use client";
/**
 * Main answering machine component that provides the skeuomorphic interface
 */

import Image from "next/image";
import React from "react";

import styles from "./AnsweringMachine.module.css";
import tapeRecorderImg from "./TAPERECORDER.png";

interface AnsweringMachineProps {
  className?: string;
  onRecord?: () => void;
  onStop?: () => void;
  isRecording?: boolean;
}

export const AnsweringMachine: React.FC<AnsweringMachineProps> = ({
  className = "",
  onRecord,
  onStop,
  isRecording = false,
}) => {
  const handleRecord = (): void => {
    if (onRecord) onRecord();
  };

  const handleStop = (): void => {
    if (onStop) onStop();
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <Image
        src={tapeRecorderImg}
        alt="Vintage tape recorder answering machine"
        className={styles.image}
        priority
      />

      <div className={styles.controlsOverlay} aria-label="Controls">
        <button
          type="button"
          className={`${styles.controlButton} ${styles.recordButton} ${
            isRecording ? styles.pressed : ""
          }`}
          onClick={handleRecord}
          aria-label="Record"
          aria-pressed={isRecording}
        >
          <span style={{ transform: "translateY(-0.06em)" }} aria-hidden="true">
            ●
          </span>
        </button>
        <button
          type="button"
          className={`${styles.controlButton} ${styles.stopButton}`}
          onClick={handleStop}
          aria-label="Stop"
        >
          <span aria-hidden="true" style={{ transform: "translateY(-0.08em)" }}>
            ■
          </span>
        </button>
      </div>
    </div>
  );
};
