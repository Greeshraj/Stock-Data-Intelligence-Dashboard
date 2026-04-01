# 📊 Stock Market Dashboard (Full Stack)

A full-stack stock analysis and visualization platform built using **FastAPI + React**, providing real-time stock insights, comparison tools, and short-term price predictions.

---

## 🚀 Features

### 📈 Stock Analysis

* Historical stock data (Open, Close)
* Daily returns calculation
* 7-day moving average
* 52-week high & low
* Volatility & risk scoring

---

### 🤖 Price Prediction

* Predict next **15 days of stock prices**
* Based on:

  * Trend (mean return)
  * Volatility (risk)
* Monte Carlo-style simulation
* Visualized as **dashed red line on chart**

---

### 📊 Interactive Dashboard (Frontend)

* Dynamic price charts using Chart.js
* Multiple time filters:

  * 7D, 15D, 30D, 90D, 180D, 1Y, ALL
* Smooth UI with skeleton loaders
* Dark/Light theme support

---

### 🔍 Stock Search & Watchlist

* Search stocks by name or symbol
* Sidebar watchlist
* Instant stock switching

---

### 🏆 Top Gainers & Losers

* Live ticker in navbar
* Displays top 3 gainers & losers

---

### ⚖️ Stock Comparison

* Compare any two stocks
* Metrics:

  * Returns
  * Volatility
  * Correlation
* Auto-generated insights:

  * Best performer
  * Riskier stock

---

## 🧠 Tech Stack

### 🔹 Frontend

* React.js
* React Router
* Chart.js
* Axios
* CSS

### 🔹 Backend

* FastAPI
* Pandas, NumPy
* yfinance (Yahoo Finance API)
* Scikit-learn (basic ML support)

---

## 📁 Project Structure

```bash
project-root/
│
├── backend/
│   ├── main.py
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── ...
│   └── ...
│
└── README.md
```

---

## ⚙️ Setup Instructions

---

## 🔹 1. Clone Repository

```bash
git clone <your-repo-url>
cd project-root
```

---

## 🔹 2. Backend Setup (FastAPI)

```bash
cd backend
```

### Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows
```

### Install Dependencies

```bash
pip install fastapi uvicorn pandas numpy yfinance scikit-learn
```

### Run Backend

```bash
uvicorn main:app --reload
```

Backend runs at:
👉 http://127.0.0.1:8000

---

## 🔹 3. Frontend Setup (React)

```bash
cd ../frontend
```

### Install Dependencies

```bash
npm install
```

### Run Frontend

```bash
npm start
```

Frontend runs at:
👉 http://localhost:3000

---

## 🔗 API Endpoints

| Endpoint         | Description                           |
| ---------------- | ------------------------------------- |
| `/data/{symbol}` | Get stock data + summary + prediction |
| `/stocks`        | Search stocks                         |
| `/topstocks`     | Top gainers & losers                  |
| `/compare`       | Compare two stocks                    |

---

## 📊 How Prediction Works

1. Take last **30 days of returns**
2. Compute:

   * Mean return (trend)
   * Standard deviation (volatility)
3. Simulate future prices:

```bash
Next Price = Current Price × (1 + Random Shock)
```

4. Repeat for 15 days

---

## ⚠️ Important Notes

* Uses **Yahoo Finance (yfinance)** → requires internet
* Only supports **NSE stocks** (`.NS` suffix added automatically)
* Prediction is **not financial advice**

---

## 💡 Future Improvements

* LSTM / Deep Learning models
* Real-time WebSocket updates
* Portfolio tracking
* Authentication system
* Deployment (Render / AWS / Vercel)

---

## 👨‍💻 Author

Greeshraj Patairiya

---

## ⭐ Support

If you like this project:

* ⭐ Star this repo
* 🍴 Fork it
* 🤝 Contribute

---

## 📌 Bonus (For Recruiters 👀)

This project demonstrates:

* Full-stack development (React + FastAPI)
* Data analysis with Pandas
* Financial metrics computation
* ML-based prediction logic
* Clean UI/UX design
* API integration & system design

---
