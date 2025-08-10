/**
 * Digital display component that shows recording time and status
 */

import React from "react";

interface DigitalDisplayProps {
  time: string;
  status: "idle" | "recording" | "uploading" | "success" | "error";
  className?: string;
}

export const DigitalDisplay: React.FC<DigitalDisplayProps> = ({
  time,
  status,
  className = "",
}) => {
  const getStatusText = (): string => {
    switch (status) {
      case "recording":
        return "Recording...";
      case "uploading":
        return "Uploading...";
      case "success":
        return "Message Saved!";
      case "error":
        return "Error";
      default:
        return "Ready";
    }
  };

  return (
    <div className={`digital-display ${status} ${className}`}>
      <div className="time-display">{time}</div>
      <div className="status-display">{getStatusText()}</div>
    </div>
  );
};
