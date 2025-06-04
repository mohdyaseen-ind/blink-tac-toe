Blink-Tac-Toe

Tech-Stack : React.js

Emoji Categories :    
 "Animals": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
 "Food": ["🍎", "🍕", "🍔", "🍣", "🍦", "🍩", "🍪", "🍓"],
 "Sports": ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🎱", "🎳"],
 "Nature": ["🌳", "🌸", "☀️", "🌈", "🌊", "🍂", "🌧️", "⚡"],

 How the "Vanishing" Feature Works
The game has a dynamic "vanishing" feature. Each player can only have 3 emojis on the board at a time.

Mechanism:
The game tracks each player's emojis. When a player places their 4th emoji, the oldest emoji they placed automatically disappears from the board to make room. This "First-In, First-Out" (FIFO) system keeps the board constantly changing and requires adaptive strategy.

Potential Improvements with More Time
If I had more time, I'd love to enhance Blink Tac Toe with these features:

Custom Emoji Feature: Allow players to upload or select their own emojis to play with, beyond the pre-defined categories. This would add a significant layer of personalization and fun.
Enhanced Animations & Visual Polish: Implement more fluid and dynamic animations for emoji placement, winning lines, power-up activations, and general UI transitions. This would greatly improve the overall user experience and visual appeal, bringing it even closer to the vibrant style of JindoBlu.
AI Opponent: Develop a simple AI (perhaps using a minimax algorithm for perfect play or a simpler heuristic-based AI) for a single-player mode.
Sound Effects Variety: Add different sound effects for various actions, not just placement and win, or more nuanced sounds for different emojis.
Responsive Design Refinement: While the current design is responsive, further fine-tuning for specific mobile devices and tablet orientations could enhance usability.
Game Settings & Customization: Allow players to customize board size, MaxEmojis limit, or even create custom emoji categories.
Undo/Redo Feature: A simple undo button for casual play, though this might complicate the power-up logic.

Live Deployed link:- https://blink-tac-toe1.netlify.app/
