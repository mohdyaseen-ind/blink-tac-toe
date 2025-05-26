// src/components/BlinkTacToe.jsx
import React, { useState, useEffect, useRef } from "react";
import { checkWin } from "../utils/checkWin"; // Corrected path
import { EmojiCategories, BoardSize, MaxEmojis, EmojiPowers } from "../constants/emojiCategories"; // Corrected path

import CategorySelector from "./CategorySelector";
import Board from "./Board";
// No explicit import for GameInfo.jsx as its logic is integrated directly into BlinkTacToe.jsx

const styles = {
    container: {
        width: "100vw", // Viewport width
        height: "100vh", // Viewport height
        margin: 0,
        padding: 0,
        fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
        backgroundColor: "#1a1a2e", // Dark background inspired by JindoBlu
        color: "#e0e0e0", // Light text for dark background
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box", // Essential for padding/border calculations
        overflow: "auto", // Allows scrolling if content exceeds screen height, especially on smaller devices
    },
    gameContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 20,
        width: "100%", // Take full width of parent
        maxWidth: 600, // Limit maximum width for better readability on large screens
        padding: 20,
        boxSizing: "border-box",
        backgroundColor: "#2a2a4a", // Slightly lighter dark background for game area
        borderRadius: 10,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)", // Subtle shadow
    },
    button: {
        padding: "12px 25px",
        margin: "10px 8px",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        fontSize: 17,
        fontWeight: "bold",
        transition: "background-color 0.3s ease, transform 0.1s ease",
        whiteSpace: "nowrap",
        boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        textTransform: "uppercase",
        "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
        },
        "&:active": {
            transform: "translateY(0)",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
        },
    },
    primaryButton: {
        backgroundColor: "#4CAF50", // Green accent for primary actions
        color: "#fff",
    },
    secondaryButton: {
        backgroundColor: "#007bff", // Blue accent for secondary actions
        color: "#fff",
    },
    dangerButton: {
        backgroundColor: "#dc3545", // Red for reset/danger
        color: "#fff",
    },
    infoText: {
        marginTop: 15,
        fontSize: 19,
        fontWeight: "bold",
        textAlign: "center",
        color: "#88e0e0", // A teal/cyan for info
    },
    scoreContainer: {
        marginTop: 25,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        color: "#e0e0e0",
    },
    winnerMessage: {
        marginTop: 30,
        fontSize: 28,
        color: "#4CAF50", // Bright green for winner
        fontWeight: "bold",
        textAlign: "center",
        textShadow: "0 0 10px rgba(76, 175, 80, 0.6)",
    },
    checkboxContainer: {
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        color: "#bbbbbb",
    },
    checkboxInput: {
        marginRight: 10,
        transform: "scale(1.4)",
        accentColor: "#4CAF50",
    },
    categorySelectorSection: {
        display: "flex",
        flexDirection: "column",
        gap: 15,
        marginBottom: 20,
        width: "100%",
        maxWidth: 400,
        alignItems: "center",
    },
    playerTurnText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textShadow: '0 0 8px rgba(255, 255, 255, 0.2)',
    },
    player1Turn: {
        color: '#ff6b6b', // Player 1 accent color (reddish)
    },
    player2Turn: {
        color: '#4ecdc4', // Player 2 accent color (bluish-green)
    },
};

export default function BlinkTacToe() {
    // --- Game State ---
    const [board, setBoard] = useState(Array(BoardSize * BoardSize).fill(null));
    const [playerTurn, setPlayerTurn] = useState(1);
    const [playerCategories, setPlayerCategories] = useState({ 1: null, 2: null });
    const [gameStarted, setGameStarted] = useState(false);
    const [playerEmojis, setPlayerEmojis] = useState({ 1: [], 2: [] }); // Stores { pos: idx, emoji: "..." }
    const [winner, setWinner] = useState(null);
    const [winningCombo, setWinningCombo] = useState([]);
    const [scores, setScores] = useState({ 1: 0, 2: 0 });

    // --- God Mode State (Timer) ---
    const [godModeEnabled, setGodModeEnabled] = useState(false);
    const [turnTimer, setTurnTimer] = useState(5); // Initial timer value
    const [turnTimeoutId, setTurnTimeoutId] = useState(null); // To clear previous timeouts

    // --- Power-up States ---
    const [playerPowersUsed, setPlayerPowersUsed] = useState({ 1: false, 2: false }); // Tracks if power used in current game
    const [doubleDropActive, setDoubleDropActive] = useState(false); // True if "Double Drop" power is active for current turn
    const [swapMode, setSwapMode] = useState([]); // Stores [firstClickedCellIdx] for "Swap" power
    const [blockedCell, setBlockedCell] = useState(null); // Stores the index of the blocked cell
    const [blockedTurnsLeft, setBlockedTurnsLeft] = useState(0); // How many turns the cell remains blocked
    const [awaitingBlockSelection, setAwaitingBlockSelection] = useState(false); // True if "Block" power is active and awaiting cell selection

    // --- Audio Refs ---
    const placeSound = useRef(null);
    const winSound = useRef(null);

    // Initialize audio elements once on component mount
    useEffect(() => {
        placeSound.current = new Audio("/place.wav");
        winSound.current = new Audio("/win.wav");
    }, []);

    // Helper to play sounds
    function playSound(audioRef) {
        if (audioRef.current) {
            audioRef.current.currentTime = 0; // Rewind to start if already playing
            audioRef.current.play().catch(e => console.error("Audio Play Error:", e));
        }
    }

    // Handles category selection for players before game starts
    function handleCategorySelect(player, category) {
        setPlayerCategories((prev) => ({ ...prev, [player]: category }));
    }

    // Starts the game once categories are selected
    function startGame() {
        if (playerCategories[1] && playerCategories[2]) {
            setGameStarted(true);
            if (godModeEnabled) setTurnTimer(5); // Reset timer if God Mode is on
        } else {
            alert("Both players must select categories to start");
        }
    }

    // Core game logic for placing emojis and handling power interactions
    function placeEmoji(idx) {
        if (!gameStarted || winner) return; // Prevent moves if game not started or won

        // --- BLOCK POWER LOGIC (Phase 2: selecting cell to block) ---
        if (awaitingBlockSelection) {
            if (board[idx]) {
                alert("Cannot block a cell that already has an emoji.");
                return;
            }
            if (blockedCell === idx) { // Prevent blocking the same cell again if somehow trying
                alert("This cell is already blocked.");
                return;
            }
            setBlockedCell(idx);
            setBlockedTurnsLeft(2); // Block for 2 turns
            setAwaitingBlockSelection(false); // Deactivate block selection mode
            setPlayerPowersUsed((prev) => ({ ...prev, [playerTurn]: true })); // Mark power as used for current player
            alert(`Cell ${idx} is now blocked for 2 turns!`);
            // Power used, now switch turns
            setPlayerTurn(playerTurn === 1 ? 2 : 1);
            if (godModeEnabled) setTurnTimer(5); // Reset timer after power usage
            return; // Exit placeEmoji, as a cell was blocked, not an emoji placed
        }

        // --- SWAP POWER LOGIC ---
        if (swapMode.length > 0) { // If swap mode is active (first emoji selected)
            const currentPlayerEmojisPositions = playerEmojis[playerTurn].map(e => e.pos);

            // If selecting the second emoji for swap
            if (swapMode.length === 1) {
                const [firstSelectedIdx] = swapMode;

                // Ensure the second selected cell contains the current player's emoji
                if (!currentPlayerEmojisPositions.includes(idx)) {
                    alert("You can only select your own emojis to swap.");
                    return;
                }
                // Cannot swap an emoji with itself
                if (firstSelectedIdx === idx) {
                    alert("Cannot swap an emoji with itself. Select a different cell.");
                    return;
                }

                const newBoard = [...board];
                const emoji1 = newBoard[firstSelectedIdx]; // Get emoji data from first selected cell
                const emoji2 = newBoard[idx]; // Get emoji data from second selected cell

                // Perform the swap on the board
                newBoard[firstSelectedIdx] = emoji2;
                newBoard[idx] = emoji1;

                // Update playerEmojis positions for both swapped emojis
                setPlayerEmojis(prev => {
                    const updatedPlayerEmojis = { ...prev };
                    updatedPlayerEmojis[playerTurn] = updatedPlayerEmojis[playerTurn].map(e => {
                        if (e.pos === firstSelectedIdx) return { ...e, pos: idx }; // Update first emoji's position
                        if (e.pos === idx) return { ...e, pos: firstSelectedIdx }; // Update second emoji's position
                        return e;
                    });
                    return updatedPlayerEmojis;
                });

                setBoard(newBoard); // Update the board state
                setSwapMode([]); // Deactivate swap mode
                setPlayerPowersUsed((prev) => ({ ...prev, [playerTurn]: true })); // Mark power as used
                playSound(placeSound); // Play a general "action" sound for swap
                setPlayerTurn(playerTurn === 1 ? 2 : 1); // Switch turn after swap is completed
                if (godModeEnabled) setTurnTimer(5); // Reset timer after power usage
                return; // Exit placeEmoji, as a swap was completed
            }
            // If swapMode.length is 0, it means it's the first click for swap, which is handled implicitly by setting swapMode[idx]
        }

        // --- NORMAL PLACE LOGIC (and checks for blocked cells) ---
        if (board[idx]) {
            alert("This cell is already occupied.");
            return; // Cell already has an emoji
        }
        if (blockedCell === idx) {
            alert("This cell is currently blocked. You cannot place an emoji here.");
            return; // Cell is blocked by "Block" power
        }

        const category = playerCategories[playerTurn];
        if (!category) {
            alert(`Player ${playerTurn} has no emoji category selected.`);
            return;
        }

        const emojis = EmojiCategories[category];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        let updatedPlayerEmojis = [...playerEmojis[playerTurn]];
        let updatedBoard = [...board];

        // Blink mechanics: Remove oldest emoji if MaxEmojis reached
        if (updatedPlayerEmojis.length === MaxEmojis) {
            const oldest = updatedPlayerEmojis.shift(); // Remove the oldest emoji from the player's list
            updatedBoard[oldest.pos] = null; // Clear the oldest emoji from the board
        }

        // Place new emoji on the board and add to player's list
        updatedBoard[idx] = { player: playerTurn, emoji: randomEmoji };
        updatedPlayerEmojis.push({ pos: idx, emoji: randomEmoji });

        setBoard(updatedBoard);
        setPlayerEmojis((prev) => ({ ...prev, [playerTurn]: updatedPlayerEmojis }));

        playSound(placeSound); // Play emoji placement sound

        // Check for win after every move
        const winCombo = checkWin(updatedBoard, playerTurn);
        if (winCombo) {
            setWinner(playerTurn);
            setWinningCombo(winCombo);
            setScores(prev => ({ ...prev, [playerTurn]: prev[playerTurn] + 1 }));
            playSound(winSound); // Play win sound
            return; // Game ended, no further actions
        }

        // --- GOD MODE TIMER RESET ---
        if (godModeEnabled) {
            setTurnTimer(5); // Reset timer for the next turn
        }

        // --- BLOCK POWER DECREMENT (If a cell is currently blocked) ---
        if (blockedTurnsLeft > 0) {
            setBlockedTurnsLeft(prev => {
                const newVal = prev - 1;
                if (newVal === 0) {
                    setBlockedCell(null); // Unblock the cell when turns run out
                    alert(`Cell ${idx} is now unblocked!`); // Inform player
                }
                return newVal;
            });
        }

        // --- DOUBLE DROP POWER LOGIC ---
        if (doubleDropActive) {
            setDoubleDropActive(false); // Deactivate after one extra drop
            // IMPORTANT: Do NOT switch player turn here if double drop is active.
            // Player gets to make another move immediately.
            alert("Double Drop active! Place one more emoji.");
            return;
        }

        // --- SWITCH TURN (Normal game flow) ---
        // Only switch turn if no win, no double drop active, and not in block/swap selection
        setPlayerTurn(playerTurn === 1 ? 2 : 1);
    }

    // Resets all game states to initial values
    function resetGame() {
        setBoard(Array(BoardSize * BoardSize).fill(null));
        setPlayerEmojis({ 1: [], 2: [] });
        setWinner(null);
        setWinningCombo([]);
        setPlayerTurn(1);
        setGameStarted(false);
        setTurnTimer(5); // Reset timer to default
        setPlayerPowersUsed({ 1: false, 2: false }); // Reset power usage for both players
        setBlockedCell(null); // Clear any blocked cell
        setBlockedTurnsLeft(0); // Reset blocked turns
        setAwaitingBlockSelection(false); // Reset block selection mode
        setDoubleDropActive(false); // Reset double drop
        setSwapMode([]); // Reset swap mode
    }

    // Activates the current player's chosen power
    function activatePower() {
        if (playerPowersUsed[playerTurn]) {
            alert("Power already used this game!");
            return;
        }
        if (winner) return; // Cannot activate power if game is won
        if (awaitingBlockSelection || swapMode.length > 0) {
            alert("You are already in a power activation mode. Complete or cancel the current action.");
            return; // Prevent activating a new power while another is pending
        }

        const category = playerCategories[playerTurn];
        const power = EmojiPowers[category];

        switch (power) {
            case "Double Drop":
                alert("You may drop 2 emojis in a row this turn! Place your first emoji now.");
                setDoubleDropActive(true);
                setPlayerPowersUsed((prev) => ({ ...prev, [playerTurn]: true })); // Mark power as used immediately
                break;
            case "Swap":
                alert("Swap power activated! Click two of your own emojis to swap their positions.");
                setSwapMode([]); // Initialize swap mode (empty array indicates awaiting first click)
                setPlayerPowersUsed((prev) => ({ ...prev, [playerTurn]: true })); // Mark power as used immediately
                // The actual swap execution and turn switch happens in placeEmoji after two clicks
                break;
            case "Block":
                alert("Click an EMPTY cell on the board to block it for 2 turns. No one can place an emoji there.");
                setAwaitingBlockSelection(true); // Set state to await cell selection
                // The power is marked as used and turn switches in placeEmoji once a cell is selected
                break;
            default:
                console.warn("Unknown power activated:", power);
                alert("Unknown power for this category. Please check constants.");
                break;
        }
        // If God Mode is on and a power is activated, reset the timer for clarity
        if (godModeEnabled) setTurnTimer(5);
    }

    // Effect for God Mode timer and automatic turn switch
    useEffect(() => {
        // Clear any existing timeout when playerTurn changes or game state changes
        if (turnTimeoutId) {
            clearTimeout(turnTimeoutId);
            setTurnTimeoutId(null);
        }

        if (!gameStarted || winner || !godModeEnabled) return; // Only run if game started, not won, and God Mode is on

        // Set a new timeout for the turn switch
        const id = setTimeout(() => {
            alert(`Player ${playerTurn} ran out of time!`);
            setTurnTimer(5); // Reset timer for next player
            setPlayerTurn((prevTurn) => (prevTurn === 1 ? 2 : 1)); // Switch turn
        }, turnTimer * 1000);

        setTurnTimeoutId(id); // Store the timeout ID

        // Interval to update the displayed timer (countdown)
        const countdown = setInterval(() => {
            setTurnTimer((prev) => prev - 1);
        }, 1000);

        // Cleanup function to clear the interval and timeout if component unmounts or dependencies change
        return () => {
            clearInterval(countdown);
            if (turnTimeoutId) clearTimeout(turnTimeoutId);
        };
    }, [playerTurn, gameStarted, godModeEnabled, winner]); // Dependencies for effect

    // This effect ensures the timer resets when godModeEnabled is toggled mid-game
    useEffect(() => {
        if (gameStarted && godModeEnabled) {
            setTurnTimer(5);
        }
    }, [godModeEnabled, gameStarted]);

    return (
        <div style={styles.container}>
            {!gameStarted ? (
                // --- Game Setup UI ---
                <>
                    <h2 style={{ marginBottom: 30, color: "#e0e0e0" }}>Blink Tac Toe</h2>
                    <h3 style={{ marginBottom: 25, color: "#88e0e0" }}>SELECT EMOJI CATEGORIES</h3>
                    <div style={styles.checkboxContainer}>
                        <input
                            type="checkbox"
                            checked={godModeEnabled}
                            onChange={() => setGodModeEnabled(!godModeEnabled)}
                            style={styles.checkboxInput}
                        />
                        <label>
                            ENABLE **GOD MODE** (⏱️ 5S PER TURN)
                        </label>
                    </div>
                    <div style={styles.categorySelectorSection}>
                        {[1, 2].map((player) => (
                            <CategorySelector
                                key={player}
                                player={player}
                                selectedCategory={playerCategories[player]}
                                onSelect={handleCategorySelect}
                                playerColor={player === 1 ? styles.player1Turn.color : styles.player2Turn.color}
                                categoryColor={styles.infoText.color}
                            />
                        ))}
                    </div>
                    <button
                        onClick={startGame}
                        style={{ ...styles.button, ...styles.primaryButton, marginTop: 10 }}
                    >
                        START GAME
                    </button>
                </>
            ) : (
                // --- In-Game UI ---
                <div style={styles.gameContainer}>
                    <h2 style={{ marginBottom: 20, color: "#e0e0e0" }}>Blink Tac Toe</h2>

                    {/* Player Turn Indicator */}
                    <p style={{
                        ...styles.playerTurnText,
                        ...(playerTurn === 1 ? styles.player1Turn : styles.player2Turn)
                    }}>
                        PLAYER {playerTurn}'S TURN
                    </p>

                    {/* God Mode Timer Display */}
                    {godModeEnabled && (
                        <p style={{
                            ...styles.infoText,
                            color: turnTimer <= 2 ? styles.dangerButton.backgroundColor : styles.infoText.color,
                        }}>
                            ⏳ TIME LEFT: {turnTimer}S
                        </p>
                    )}

                    {/* Game Board */}
                    <Board board={board} onCellClick={placeEmoji} winningCombo={winningCombo} swapMode={swapMode} />

                    {/* Blocked Cell Info */}
                    {blockedCell !== null && (
                        <p style={{ ...styles.infoText, color: styles.dangerButton.backgroundColor, marginTop: 15 }}>
                            🚫 CELL **{blockedCell}** IS BLOCKED FOR **{blockedTurnsLeft}** MORE TURN(S)
                        </p>
                    )}

                    {/* Score Display */}
                    <div style={styles.scoreContainer}>
                        SCORE — PLAYER 1: <span style={{color: styles.player1Turn.color}}>{scores[1]}</span> | PLAYER 2: <span style={{color: styles.player2Turn.color}}>{scores[2]}</span>
                    </div>

                    {/* Use Power Button */}
                    {/* Hide if power already used, or game is won, or in block/swap selection modes */}
                    {!playerPowersUsed[playerTurn] && !awaitingBlockSelection && swapMode.length === 0 && !winner && (
                        <button
                            onClick={activatePower}
                            style={{
                                ...styles.button,
                                ...styles.secondaryButton,
                                marginTop: 25,
                            }}
                        >
                            🔥 USE POWER ({EmojiPowers[playerCategories[playerTurn]] || "No Power"})
                        </button>
                    )}

                    {/* Winner Message and Play Again Button */}
                    {winner && (
                        <div style={{ marginTop: 30, textAlign: "center" }}>
                            <h3 style={styles.winnerMessage}>🎉 PLAYER {winner} WINS!</h3>
                            <button
                                onClick={resetGame}
                                style={{ ...styles.button, ...styles.primaryButton, marginTop: 20 }}
                            >
                                PLAY AGAIN
                            </button>
                        </div>
                    )}

                    {/* Reset Game Button (always available in-game if no winner) */}
                    {!winner && gameStarted && (
                        <button
                            onClick={resetGame}
                            style={{ ...styles.button, ...styles.dangerButton, marginTop: 15 }}
                        >
                            RESET GAME
                        </button>
                    )}
                </div>
            )}
        </div>  
    );
}