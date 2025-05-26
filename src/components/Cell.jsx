// src/components/Cell.jsx
import React from "react";

export default function Cell({ emojiData, onClick, isWinningCell, isSwapSelected }) {
    const player1Color = '#ff6b6b'; // Reddish accent
    const player2Color = '#4ecdc4'; // Bluish-green accent

    const style = {
        // Removed width/height 100% as the grid handles cell sizing
        fontSize: "2.8rem", // Larger emojis
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: emojiData ? "not-allowed" : "pointer", // Cursor for occupied cells
        backgroundColor: emojiData
            ? (emojiData.player === 1 ? player1Color + 'cc' : player2Color + 'cc') // Slightly transparent player color
            : "#2a2a4a", // Default cell background (darker than board for contrast)
        border: isWinningCell
            ? `4px solid #FFD700` // Gold for winning
            : isSwapSelected
            ? `3px dashed #FFD700` // Gold dashed for swap selection
            : `2px solid #5a5a7a`, // Subtle border for non-filled cells
        boxShadow: isWinningCell
            ? "0 0 15px 5px #FFD700" // Stronger gold glow
            : isSwapSelected
            ? "0 0 10px 3px #FFD700" // Gold glow for swap
            : "0 0 5px rgba(0,0,0,0.3)", // Subtle shadow
        transition: "all 0.2s ease-in-out", // Smooth transitions
        borderRadius: 8, // Rounded corners for cells
        color: "#fff", // Emojis should be white/light on dark background
        fontWeight: 'bold', // Make emojis appear bolder
    };

    return (
        <button
            style={style}
            onClick={onClick}
            // Disable if occupied AND not in swap selection (allow clicking your own emoji to swap)
            disabled={!!emojiData && !isSwapSelected && !onClick} // Added !onClick to ensure it's not disabled if no handler
            title={emojiData ? `Player ${emojiData.player} - ${emojiData.emoji}` : ""}
        >
            {emojiData ? emojiData.emoji : ""}
        </button>
    );
}