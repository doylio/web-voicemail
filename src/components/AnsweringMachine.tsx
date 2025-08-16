"use client";
/**
 * Main answering machine component that provides the skeuomorphic interface
 */

import Image from "next/image";
import React, { useEffect, useState } from "react";

import tapeRecorderImg from "@/assets/recorder_nowheels.png";
import tapeRecorderWheelsImg from "@/assets/recorder_WHEEL.png";

import styles from "./AnsweringMachine.module.css";

interface AnsweringMachineProps {
  className?: string;
  onRecord: () => void;
  onStop: () => void;
  isRecording?: boolean;
  startRecordingTime: number | null;
  error: string | null;
  info: string | null;
}

export const AnsweringMachine: React.FC<AnsweringMachineProps> = ({
  className = "",
  onRecord,
  onStop,
  isRecording,
  startRecordingTime,
  error,
  info,
}) => {
  const [nowTs, setNowTs] = useState<number>(Date.now());

  useEffect((): (() => void) | void => {
    if (!startRecordingTime) return;
    setNowTs(Date.now());
    const intervalId = window.setInterval(() => {
      setNowTs(Date.now());
    }, 1000);
    return (): void => window.clearInterval(intervalId);
  }, [startRecordingTime]);

  const formatDuration = (startRecording: number): string => {
    const now = nowTs;
    const totalSeconds = Math.max(0, Math.floor((now - startRecording) / 1000));
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <>
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
        />

        <Image
          src={tapeRecorderWheelsImg}
          alt="Vintage tape recorder answering machine"
          className={`${styles.recorderWheel} ${styles.rightWheel} ${
            isRecording ? styles.spinningWheel : ""
          }`}
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
            <span
              style={{ transform: "translateY(-0.06em)" }}
              aria-hidden="true"
            >
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
            <span
              aria-hidden="true"
              style={{ transform: "translateY(-0.08em)" }}
            >
              ■
            </span>
          </button>
        </div>
      </div>

      <div className={styles.footer}>
        {startRecordingTime && (
          <div className={`${styles.footerText} ${styles.durationText}`}>
            {formatDuration(startRecordingTime)}
          </div>
        )}

        {error && (
          <div className={`${styles.footerText} ${styles.errorText}`}>
            {error}
          </div>
        )}

        {info && (
          <div className={`${styles.footerText} ${styles.infoText}`}>
            {info}
          </div>
        )}
      </div>
    </>
  );
};
