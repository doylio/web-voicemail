"use client";
/**
 * Main answering machine component that provides the skeuomorphic interface
 */

import Image from "next/image";
import React from "react";

import tapeRecorderImg from "@/assets/recorder_nowheels.png";
import tapeRecorderWheelsImg from "@/assets/recorder_WHEEL.png";

import styles from "./AnsweringMachine.module.css";

interface AnsweringMachineProps {
  className?: string;
  onRecord: () => void;
  onStop: () => void;
  isRecording?: boolean;
}

export const AnsweringMachine: React.FC<AnsweringMachineProps> = ({
  className = "",
  onRecord,
  onStop,
  isRecording,
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <Image
        src={tapeRecorderImg}
        alt="Vintage tape recorder answering machine"
        className={styles.image}
        priority
      />

      <Image
        src={tapeRecorderWheelsImg}
        alt="Vintage tape recorder answering machine"
        className={`${styles.recorderWheel} ${styles.leftWheel} ${
          isRecording ? styles.spinningWheel : ""
        }`}
        priority
      />

      <Image
        src={tapeRecorderWheelsImg}
        alt="Vintage tape recorder answering machine"
        className={`${styles.recorderWheel} ${styles.rightWheel} ${
          isRecording ? styles.spinningWheel : ""
        }`}
        priority
      />

      <div className={styles.controlsOverlay} aria-label="Controls">
        <button
          type="button"
          className={`${styles.controlButton} ${styles.recordButton} ${
            isRecording ? styles.pressed : ""
          }`}
          onClick={onRecord}
          disabled={isRecording}
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
          onClick={onStop}
          disabled={!isRecording}
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
