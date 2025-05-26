// src/components/CategorySelector.jsx
import React from "react";
import { EmojiCategories } from "../constants/emojiCategories"; // Ensure path is correct

const categoryStyles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#2a2a4a", // Dark background
        padding: 15,
        borderRadius: 8,
        width: "100%",
        boxSizing: "border-box",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    },
    label: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#e0e0e0", // Light text
        marginBottom: 5,
    },
    select: {
        width: "80%",
        padding: "10px 15px",
        borderRadius: 5,
        border: "1px solid #5a5a7a", // Subtle border
        backgroundColor: "#3a3a5a", // Darker input background
        color: "#e0e0e0", // Light text for options
        fontSize: 16,
        appearance: 'none', // Remove default arrow
        background: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23e0e0e0%22%20d%3D%22M6%209l6-6H0z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 10px center',
        backgroundSize: '12px',
        cursor: 'pointer',
    },
    selectedCategoryText: {
        marginTop: 10,
        fontSize: 16,
        color: '#88e0e0', // Teal/cyan for selected info
    }
};

export default function CategorySelector({ player, selectedCategory, onSelect, playerColor, categoryColor }) {
    return (
        <div style={categoryStyles.container}>
            <label style={{ ...categoryStyles.label, color: playerColor }}>
                PLAYER {player} CATEGORY:
            </label>
            <select
                style={categoryStyles.select}
                value={selectedCategory || ""}
                onChange={(e) => onSelect(player, e.target.value)}
            >
                <option value="" disabled>SELECT A CATEGORY</option>
                {Object.keys(EmojiCategories).map((category) => (
                    <option key={category} value={category}>
                        {category.toUpperCase()}
                    </option>
                ))}
            </select>
            {selectedCategory && (
                <p style={{...categoryStyles.selectedCategoryText, color: categoryColor}}>
                    SELECTED: {selectedCategory.toUpperCase()}
                </p>
            )}
        </div>
    );
}