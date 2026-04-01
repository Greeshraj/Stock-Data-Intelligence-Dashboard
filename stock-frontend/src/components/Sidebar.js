import React, { useEffect, useState } from "react";
import axios from "axios";
const BACKEND_URL = "https://stock-data-dashboard-backend.onrender.com"
// const BACKEND_URL = "http://127.0.0.1:8000"
function Sidebar({ selectedStock, setSelectedStock }) {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState("");

  // 🔥 Fetch stocks with search
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/stocks?search=${search}`
        );
        setStocks(res.data);
      } catch (err) {
        console.error("Error fetching stocks", err);
      }
    };

    fetchStocks();
  }, [search]);

  return (
    <div style={{
      width: "240px",
      background: "#020617",
      padding: "10px",
      borderRadius: "12px"
    }}>

      <h3 style={{ color: "#ffffff" }}>Watchlist</h3>

      {/* 🔍 SEARCH BAR */}
      <input
        type="text"
        placeholder="Search stock..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "10px",
          borderRadius: "6px",
          border: "none",
          outline: "none",
          background: "#0f172a",
          color: "#e2e8f0"
        }}
      />

      {/* 📈 STOCK LIST */}
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {stocks.map((stock) => (
          <div
            key={stock.symbol}
            onClick={() => setSelectedStock(stock.symbol)}
            style={{
              padding: "10px",
              margin: "4px 0",
              borderRadius: "8px",
              cursor: "pointer",
              background:
                selectedStock === stock.symbol
                  ? "#1e293b"
                  : "transparent",
              color:
                selectedStock === stock.symbol
                  ? "#22c55e"
                  : "#94a3b8",
              transition: "0.2s"
            }}
          >
            {/* 🔥 Show Name + Symbol */}
            <div style={{ fontWeight: "bold" }}>
              {stock.symbol}
            </div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              {stock.name}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Sidebar;