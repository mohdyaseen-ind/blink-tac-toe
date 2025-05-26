// src/constants/emojiCategories.js
export const BoardSize = 3; // For a 3x3 Tic Tac Toe
export const MaxEmojis = 3; // Max emojis each player can have on board simultaneously (like in Blink Tic Tac Toe)

export const EmojiCategories = {
    "Animals": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
    "Food": ["🍎", "🍕", "🍔", "🍣", "🍦", "🍩", "🍪", "🍓"],
    "Sports": ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🎱", "🎳"],
    "Nature": ["🌳", "🌸", "☀️", "🌈", "🌊", "🍂", "🌧️", "⚡"],
    // Add more categories if you wish, and remember to define their powers below
};

// Define the specific power associated with each category
export const EmojiPowers = {
    "Animals": "Double Drop", // Allows player to place two emojis in one turn
    "Food": "Swap",           // Allows player to swap positions of two of their own emojis
    "Sports": "Block",        // Allows player to block one empty cell for 2 turns
    "Nature": "Double Drop",  // Example: You can have multiple categories use the same power
    // Ensure every category in EmojiCategories has a corresponding power defined here.
};