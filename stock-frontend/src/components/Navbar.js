import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar({ theme }) {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
const navigate = useNavigate();
  useEffect(() => {
    const fetchTopStocks = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/topstocks");
        setGainers(res.data.top_gainers);
        setLosers(res.data.top_losers);
      } catch (err) {
        console.error("Error fetching top stocks", err);
      }
    };

    fetchTopStocks();
  }, []);

  return (
    <div className={`navbar ${theme}`}>
      
      <h2
  className="logo"
  onClick={() => navigate("/")}
  style={{ cursor: "pointer" }}
>
  📈 Stock Dashboard
</h2>

      <div className="ticker-container">

        {/* 🔼 GAINERS */}
        <div className="ticker-section">
          <span className="ticker-title green">Top Gainers</span>
          <div className="ticker-scroll">
            {gainers.map((stock, i) => (
              <div key={i} className="ticker-item green">
                {stock.symbol} ↑ {stock.pct_change}%
              </div>
            ))}
          </div>
        </div>

        {/* 🔽 LOSERS */}
        <div className="ticker-section">
          <span className="ticker-title red">Top Losers</span>
          <div className="ticker-scroll">
            {losers.map((stock, i) => (
              <div key={i} className="ticker-item red">
                {stock.symbol} ↓ {stock.pct_change}%
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Navbar;