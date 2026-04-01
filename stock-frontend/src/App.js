import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ComparePage from "./pages/ComparePage";
import Navbar from "./components/Navbar";

import { lightTheme, darkTheme } from "./theme";

function App() {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const currentTheme = theme === "dark" ? darkTheme : lightTheme;

  return (
    <Router>
      <div
        style={{
          background: currentTheme.background,
          minHeight: "100vh"
        }}
      >
        {/* 🔥 Navbar stays on ALL pages */}
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        {/* 🔥 Page Routing */}
        <Routes>
          <Route path="/" element={<Home theme={theme} />} />
          <Route path="/compare" element={<ComparePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;