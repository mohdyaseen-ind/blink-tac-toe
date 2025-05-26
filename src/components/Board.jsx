// src/components/Board.jsx
import React from "react";
import Cell from "./Cell";
import { BoardSize } from "../constants/emojiCategories"; // Ensure path is correct

export default function Board({ board, onCellClick, winningCombo = [], swapMode = [] }) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${BoardSize}, 80px)`, // Larger cells
                gridTemplateRows: `repeat(${BoardSize}, 80px)`,   // Square cells
                gap: 8, // Slightly larger gap
                backgroundColor: "#3a3a5a", // Board background color
                padding: 10,
                borderRadius: 10,
                boxShadow: "inset 0 0 15px rgba(0,0,0,0.5)", // Inner shadow for depth
            }}
        >
            {board.map((cell, idx) => (
                <Cell
                    key={idx}
                    emojiData={cell}
                    onClick={() => onCellClick(idx)}
                    isWinningCell={winningCombo.includes(idx)}
                    isSwapSelected={swapMode.includes(idx)}
                />
            ))}
        </div>
    );
}