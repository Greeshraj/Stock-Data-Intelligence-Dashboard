import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChartSection from "../components/ChartSection";
import { Link } from "react-router-dom";

function Home() {
  const [selectedStock, setSelectedStock] = useState("RELIANCE");

  return (
    <div style={{
      background: "#020617",
      minHeight: "100vh",
      padding: "10px"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "auto"
      }}>
        <h1 style={{ color: "#e2e8f0", marginBottom: "20px" }}>
          Stock Dashboard
        </h1>

        <div style={{
          display: "flex",
          gap: "0px"
        }}>
          <Sidebar
            selectedStock={selectedStock}
            setSelectedStock={setSelectedStock}
          />

          <div style={{ flex: 1 }}>
            <ChartSection stock={selectedStock} />
          </div>
{/* <Link
  to="/compare"
  style={{
    display: "inline-block",
    marginTop: "10px",
    padding: "8px 12px",
    background: "#2563eb",
    color: "white",
    borderRadius: "6px",
    textDecoration: "none",
  }}
  onMouseOver={(e) => (e.target.style.background = "#1d4ed8")}
  onMouseOut={(e) => (e.target.style.background = "#2563eb")}
>
  Compare Stocks →
</Link> */}
        </div>
      </div>
    </div>
  );
}

export default Home;