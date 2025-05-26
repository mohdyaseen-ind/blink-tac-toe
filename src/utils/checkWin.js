// src/utils/checkWin.js
import { BoardSize } from '../constants/emojiCategories'; // Ensure this path is correct

// Define the winning combinations based on BoardSize
const generateWinningCombos = (size) => {
    const combos = [];

    // Rows and columns
    for (let i = 0; i < size; i++) {
        const row = [];
        const col = [];
        for (let j = 0; j < size; j++) {
            row.push(i * size + j);
            col.push(j * size + i);
        }
        combos.push(row, col);
    }

    // Diagonals
    const diag1 = [];
    const diag2 = [];
    for (let i = 0; i < size; i++) {
        diag1.push(i * size + i);
        diag2.push(i * size + (size - 1 - i));
    }
    combos.push(diag1, diag2);

    return combos;
};

const winningCombos = generateWinningCombos(BoardSize);

export function checkWin(board, currentPlayer) {
    const playerMoves = board
        .map((cell, idx) => (cell?.player === currentPlayer ? idx : null))
        .filter((val) => val !== null);

    const winCombo = winningCombos.find((combo) =>
        combo.every((index) => playerMoves.includes(index))
    );
    return winCombo || null; // return the actual combo if won, else null
}