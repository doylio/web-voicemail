/**
 * Main answering machine component that provides the skeuomorphic interface
 */

import React from "react";

interface AnsweringMachineProps {
  className?: string;
}

export const AnsweringMachine: React.FC<AnsweringMachineProps> = ({
  className = "",
}) => {
  return (
    <div className={`answering-machine ${className}`}>
      <div className="machine-body">
        <h1>Skeuomorphic Answering Machine</h1>
        <p>Placeholder for the main answering machine interface</p>

        {/* Digital Display */}
        <div className="digital-display">
          <span>00:00</span>
        </div>

        {/* Control Buttons */}
        <div className="control-buttons">
          <button className="record-button">Record</button>
          <button className="play-button" disabled>
            Play
          </button>
          <button className="stop-button" disabled>
            Stop
          </button>
          <button className="rewind-button" disabled>
            Rewind
          </button>
        </div>

        {/* Tape Reels */}
        <div className="tape-reels">
          <div className="reel left-reel"></div>
          <div className="reel right-reel"></div>
        </div>
      </div>
    </div>
  );
};
