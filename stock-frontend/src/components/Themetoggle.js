import React from "react";

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button onClick={toggleTheme} style={{
      padding: "8px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      background: theme === "dark" ? "#22c55e" : "#1e293b",
      color: "#fff",
      border: "none"
    }}>
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

export default ThemeToggle;