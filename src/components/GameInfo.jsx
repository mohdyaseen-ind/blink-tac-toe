import React from "react";

export default function GameInfo({ playerTurn, message, suggestedIndex }) {
  return (
    <div style={{ marginBottom: 15 }}>
      <p>{message || `Player ${playerTurn}'s turn`}</p>
      {suggestedIndex !== null && (
        <p style={{ fontStyle: "italic", color: "gray" }}>
          🤖 Suggested move: Cell {suggestedIndex}
        </p>
      )}
    </div>
  );
}