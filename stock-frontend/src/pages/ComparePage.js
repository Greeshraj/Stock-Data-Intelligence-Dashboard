import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
} from "chart.js";

import "./ComparePage.css";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
);

const STOCKS = ["INFY", "TCS", "RELIANCE", "HDFCBANK", "ICICIBANK", "SBIN", "LT"];

function ComparePage() {
    const [symbol1, setSymbol1] = useState("");
    const [symbol2, setSymbol2] = useState("");

    const [chart, setChart] = useState([]);
    const [summary, setSummary] = useState(null);
    const [insight, setInsight] = useState("");
    const [loading, setLoading] = useState(false);
    const [correlation, setCorrelation] = useState(null);

    // 🔥 API CALL
    const handleCompare = async () => {
        if (!symbol1 || !symbol2 || symbol1 === symbol2) return;

        try {
            setLoading(true);
            setChart([]);
            setSummary(null);
            setInsight("");

            const res = await axios.get(
                `http://127.0.0.1:8000/compare?symbol1=${symbol1}&symbol2=${symbol2}`
            );

            setChart(res.data.chart || []);
            setSummary(res.data.summary || null);
            setInsight(res.data.insight || "");
            setCorrelation(res.data.correlation ?? null);
        } catch (err) {
            console.error(err);
            alert("Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    // 🔥 AUTO FETCH WITH DEBOUNCE
    useEffect(() => {
        const timer = setTimeout(() => {
            if (symbol1 && symbol2 && symbol1 !== symbol2) {
                handleCompare();
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [symbol1, symbol2]);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit"
        });
    };

    // 🔥 SAFE HELPERS
    const getWinner = () => {
        if (!summary?.[symbol1] || !summary?.[symbol2]) return "-";
        return summary[symbol1].return > summary[symbol2].return
            ? symbol1
            : symbol2;
    };

    const getRiskier = () => {
        if (!summary?.[symbol1] || !summary?.[symbol2]) return "-";
        return summary[symbol1].volatility > summary[symbol2].volatility
            ? symbol1
            : symbol2;
    };
    const getCorrelationColor = () => {
        if (correlation === null) return "";
        if (correlation > 70) return "green";
        if (correlation > 30) return "yellow";
        return "red";
    };
    return (
        <div className="main-container">

            {/* 🔽 SELECTORS */}
            <div className="compare-controls">

                <select
                    value={symbol1}
                    onChange={(e) => {
                        setSymbol1(e.target.value);
                        setSummary(null);
                        setChart([]);
                        setInsight("");
                    }}
                >
                    <option value="">Select Stock 1</option>
                    {STOCKS.map(s => <option key={s}>{s}</option>)}
                </select>

                <select
                    value={symbol2}
                    onChange={(e) => {
                        setSymbol2(e.target.value);
                        setSummary(null);
                        setChart([]);
                        setInsight("");
                    }}
                >
                    <option value="">Select Stock 2</option>
                    {STOCKS.map(s => <option key={s}>{s}</option>)}
                </select>

                <button className="compare-btn" onClick={handleCompare}>
                    Compare
                </button>
            </div>

            {/* EMPTY STATE */}
            {!summary && !loading && (
                <div className="empty-state">
                    Select two stocks and compare
                </div>
            )}

            {/* LOADING */}
            {loading && (
                <div className="chart-box">
                    <div className="skeleton chart"></div>
                </div>
            )}

            {/* RESULT */}
            {summary && chart.length > 0 && (
                <div className="content">

                    {/* 📊 CHART */}
                    <div className="chart-box">
                        <h2>{symbol1} vs {symbol2}</h2>

                        <Line
                            data={{
                                labels: chart.map(i => formatDate(i.Date)),
                                datasets: [
                                    {
                                        label: symbol1,
                                        data: chart.map(i => i[symbol1]),
                                        borderColor: "#22c55e",
                                        tension: 0.4,
                                        pointRadius: 0
                                    },
                                    {
                                        label: symbol2,
                                        data: chart.map(i => i[symbol2]),
                                        borderColor: "#3b82f6",
                                        tension: 0.4,
                                        pointRadius: 0
                                    }
                                ]
                            }}
                            options={{
                                responsive: true,
                                interaction: {
                                    mode: "index",
                                    intersect: false
                                },
                                plugins: {
                                    legend: {
                                        labels: { color: "#e2e8f0" }
                                    }
                                },
                                scales: {
                                    x: {
                                        ticks: { color: "#94a3b8" }
                                    },
                                    y: {
                                        ticks: { color: "#94a3b8" }
                                    }
                                }
                            }}
                        />

                        {/* 🔥 INSIGHT */}
                        <div className="insight-box">
                            {insight}
                        </div>
                    </div>

                    {/* 📊 RIGHT PANEL */}
                    <div className="right-panel">
                        <div className="metrics-box">
                            <h3>Comparison</h3>

                            {/* RETURN */}
                            <div className="metric">
                                <span>Return</span>
                                <span>
                                    {symbol1}: {summary?.[symbol1]?.return?.toFixed(2) ?? "-"}% |{" "}
                                    {symbol2}: {summary?.[symbol2]?.return?.toFixed(2) ?? "-"}%
                                </span>
                            </div>

                            {/* VOLATILITY */}
                            <div className="metric">
                                <span>Volatility</span>
                                <span>
                                    {symbol1}: {summary?.[symbol1]?.volatility?.toFixed(3) ?? "-"} |{" "}
                                    {symbol2}: {summary?.[symbol2]?.volatility?.toFixed(3) ?? "-"}
                                </span>
                            </div>


                            {/* WINNER */}
                            <div className="metric highlight green">
                                <span>Winner</span>
                                <span>{getWinner()}</span>
                            </div>

                            {/* RISK */}
                            <div className="metric highlight red">
                                <span>More Risky</span>
                                <span>{getRiskier()}</span>
                            </div>
                            <div className={`metric highlight ${getCorrelationColor()}`}>
                                <span>Correlation</span>
                                <span>
                                    {correlation !== null ? `${correlation}%` : "-"}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

export default ComparePage;