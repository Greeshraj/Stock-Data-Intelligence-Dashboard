import React, { useEffect, useState, useSyncExternalStore } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

import "./ChartSection.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const BACKEND_URL = "https://stock-data-dashboard-backend.onrender.com"
// const BACKEND_URL = "http://127.0.0.1:8000"

function ChartSection({ stock }) {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [range, setRange] = useState("ALL");
  const [prediction, setPrediction] = useState([]);
  const [predictDays, setPredictDays] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      setData([]);
      setSummary(null);
      setPredictDays(0);
      setPrediction([]);

      const res = await axios.get(`${BACKEND_URL}/data/${stock}`);

      setData(res.data.data);        // ✅ FIXED
      setSummary(res.data.summary);  // ✅ FIXED
      setPrediction(res.data.prediction)
    };

    fetchData();
  }, [stock]);

  // ✅ Proper loading check
  // if (!data || data.length === 0 || !summary) {
  //   return <h2 className="loading">Loading...</h2>;
  // }
  if (!data || data.length === 0 || !summary) {
    return (
      <div className="main-container">
        <div className="content">

          {/* LEFT: CHART SKELETON */}
          <div className="chart-box">
            <div className="skeleton title"></div>
            <div className="skeleton price"></div>

            <div className="mini-metrics">
              <div className="skeleton small"></div>
              <div className="skeleton small"></div>
              <div className="skeleton small"></div>
            </div>

            <div className="skeleton chart"></div>
          </div>

          {/* RIGHT PANEL SKELETON */}
          <div className="right-panel">

            <div className="metrics-box">
              <div className="skeleton title"></div>

              <div className="skeleton row"></div>
              <div className="skeleton row"></div>
              <div className="skeleton row"></div>
              <div className="skeleton row"></div>
            </div>

            <div className="table-box">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton table-row"></div>
              ))}
            </div>

          </div>

        </div>
      </div>
    );
  }
  console.log(prediction);
  // ✅ Use backend summary ONLY
  const latestPrice = summary.latest_price;
  const dailyReturn = summary.daily_return;
  const ma7 = summary.ma7;
  const high52 = summary.high52;
  const low52 = summary.low52;
  const volatilityScore = summary.volatility_score;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "2-digit",
    });
  };
  const getFilteredData = () => {
    if (range === "ALL") return data;

    const daysMap = {
      "7D": 7,
      "15D": 15,
      "30D": 30,
      "90D": 90,
      "180D": 180,
      "1Y": 365,
    };

    const days = daysMap[range];
    return data.slice(-days);
  };

  const filteredData = getFilteredData();
  const combinedLabels = [...filteredData.map(item => formatDate(item.Date))];

  let predictionDataset = [];

  if (predictDays === 15 && prediction.length > 0) {
    prediction.forEach(p => {
      combinedLabels.push(formatDate(p.Date));
    });

    predictionDataset = [
      {
        label: "Prediction",
        data: [
          ...new Array(filteredData.length - 1).fill(null), // align start
          filteredData[filteredData.length - 1].Close,      // connect last real point
          ...prediction.map(p => p.Predicted_Close)
        ],
        borderColor: "#ef4444",
        borderDash: [6, 6],  // 🔴 dashed line
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4
      }
    ];
  }
  // const chartData = {
  //   labels: filteredData.map(item => formatDate(item.Date)),
  //   datasets: [
  //     {
  //       label: "Price",
  //       data: filteredData.map(item => item.Close),
  //       borderWidth: 2.5,
  //       tension: 0.4,
  //       pointRadius: 0,
  //       borderColor: dailyReturn >= 0 ? "#22c55e" : "#ef4444",
  //       fill: true,
  //       backgroundColor: (context) => {
  //         const ctx = context.chart.ctx;
  //         const gradient = ctx.createLinearGradient(0, 0, 0, 300);

  //         // ✅ FIXED dynamic color
  //         if (dailyReturn >= 0) {
  //           gradient.addColorStop(0, "rgba(34,197,94,0.25)");
  //         } else {
  //           gradient.addColorStop(0, "rgba(239,68,68,0.25)");
  //         }

  //         gradient.addColorStop(1, "rgba(0,0,0,0)");
  //         return gradient;
  //       }
  //     }
  //   ]
  // };
  const chartData = {
    labels: combinedLabels,
    datasets: [
      {
        label: "Price",
        data: filteredData.map(item => item.Close),
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 0,
        borderColor: dailyReturn >= 0 ? "#22c55e" : "#ef4444",
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);

          if (dailyReturn >= 0) {
            gradient.addColorStop(0, "rgba(34,197,94,0.25)");
          } else {
            gradient.addColorStop(0, "rgba(239,68,68,0.25)");
          }

          gradient.addColorStop(1, "rgba(0,0,0,0)");
          return gradient;
        }
      },

      ...predictionDataset   // ✅ ADD THIS LINE
    ]
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "#0f172a",
        borderColor: "#1e293b",
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b" }
      },
      y: {
        grid: { color: "rgba(148,163,184,0.1)" },
        ticks: { color: "#64748b" }
      }
    }
  };

  // ✅ TABLE DATA
  const tableData = data.map((item, i) => {
    const prev = data[i - 1];

    const ret = prev
      ? ((item.Close - prev.Close) / prev.Close)
      : null;

    return {
      date: formatDate(item.Date),
      open: item.Open,
      close: item.Close,
      return: ret
    };
  });
  const getVolatilityInfo = (score) => {
    if (score <= 20) {
      return {
        label: "Low Risk",
        color: "green"
      };
    } else if (score <= 50) {
      return {
        label: "Moderate Risk",
        color: "orange"
      };
    } else {
      return {
        label: "High Risk",
        color: "red"
      };
    }
  };

  const volInfo = getVolatilityInfo(volatilityScore);

  return (
    <div className="main-container">
      <div className="content">

        {/* LEFT: CHART */}
        <div className="chart-box">
          <h2>{stock}</h2>

          <div className="price-row">
            <h3 className={dailyReturn >= 0 ? "green" : "red"}>
              ₹{Number(latestPrice).toFixed(2)}
            </h3>

            <span className={`vol-badge ${volInfo.color}`}>
              {volInfo.label}
            </span>
          </div>


          <div className="mini-metrics">
            <span>MA(7): ₹{ma7 ?? "N/A"}</span>
            <span>52H: ₹{high52}</span>
            <span>52L: ₹{low52}</span>
          </div>
          <div className="range-buttons">
            {["7D", "15D", "30D", "90D", "180D", "1Y", "ALL"].map((r) => (
              <button
                key={r}
                className={`range-btn ${range === r ? "active" : ""}`}
                onClick={() => setRange(r)}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="predict-btn-box">
            <button
              className="predict-btn"
              onClick={() =>
                setPredictDays(prev => (prev === 15 ? 0 : 15))
              }
            >
              {predictDays === 15 ? "Clear Prediction" : "Predict Next 15 Days"}
            </button>
          </div>
          <Line data={chartData} options={options} />
          <div style={{ marginTop: "15px", textAlign: "right" }}>
  <Link to="/compare" className="compare-btn">
    Compare Stocks →
  </Link>
</div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">

          {/* METRICS */}
          <div className="metrics-box">
            <h3>Metrics</h3>
            <div className="metric">
              <span>Volatility</span>
              <span className={volInfo.color}>
                {volInfo.label} ({volatilityScore})
              </span>
            </div>
            <div className="metric">
              <span>Daily Return</span>
              <span className={dailyReturn >= 0 ? "green" : "red"}>
                {dailyReturn}%
              </span>
            </div>

            <div className="metric">
              <span>7 Day MA</span>
              <span>₹{ma7 ?? "N/A"}</span>
            </div>

            <div className="metric">
              <span>52W High</span>
              <span>₹{high52}</span>
            </div>

            <div className="metric">
              <span>52W Low</span>
              <span>₹{low52}</span>
            </div>
          </div>

          {/* TABLE */}
          <div className="table-box">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Open</th>
                  <th>Close</th>
                  <th>Return</th>
                </tr>
              </thead>
              <tbody>
                {tableData.slice(-50).reverse().map((row, i) => (
                  <tr key={i}>
                    <td>{row.date}</td>
                    <td>{Number(row.open).toFixed(2)}</td>
                    <td>{Number(row.close).toFixed(2)}</td>
                    <td className={row.return > 0 ? "green" : "red"}>
                      {row.return ? (row.return * 100).toFixed(2) + "%" : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ChartSection;