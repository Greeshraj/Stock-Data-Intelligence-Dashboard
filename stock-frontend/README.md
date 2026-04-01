# 📊 Stock Dashboard Frontend (React)

A modern React-based frontend for visualizing stock data, analytics, predictions, and comparisons with an interactive UI.

---

## 🚀 Features

### 📈 Interactive Stock Chart

* Real-time stock data visualization
* Dynamic price chart using Chart.js
* Gradient-based price trends (green/red)
* Multiple time ranges:

  * 7D, 15D, 30D, 90D, 180D, 1Y, ALL

---

### 🤖 Prediction Visualization

* Toggle **Next 15 Days Prediction**
* Dashed red line for predicted prices
* Seamless connection with real price data

---

### 📊 Metrics Panel

* Latest price
* Daily return (%)
* 7-day moving average
* 52-week high & low
* Volatility score with:

  * 🟢 Low Risk
  * 🟡 Moderate Risk
  * 🔴 High Risk

---

### 🔍 Stock Search & Watchlist

* Search stocks dynamically
* Select and switch stocks instantly
* Sidebar-based watchlist UI

---

### 🏆 Top Gainers & Losers

* Live ticker in navbar
* Shows:

  * Top gainers 📈
  * Top losers 📉

---

### ⚖️ Stock Comparison Page

* Compare two stocks
* Features:

  * Normalized performance chart
  * Return comparison
  * Volatility comparison
  * Correlation analysis
  * Auto-generated insights

---

### 🎨 UI/UX Enhancements

* Skeleton loaders (smooth loading experience)
* Dark/Light theme support
* Responsive layout
* Clean dashboard design

---

## 🧠 Tech Stack

* **Frontend**: React.js
* **Routing**: React Router
* **Charts**: Chart.js + react-chartjs-2
* **HTTP Client**: Axios
* **Styling**: CSS

---

## 📁 Project Structure

```bash id="n3k2ls"
src/
│── components/
│   ├── Navbar.js
│   ├── Sidebar.js
│   ├── ChartSection.js
│
│── pages/
│   ├── Home.js
│   ├── ComparePage.js
│
│── App.js
│── theme.js
│── index.js
```

---

## 📦 Installation

### 1️⃣ Clone the Repository

```bash id="a1m9x2"
git clone <your-frontend-repo-url>
cd <your-frontend-folder>
```

---

### 2️⃣ Install Dependencies

```bash id="p9v2kl"
npm install
```

---

### 3️⃣ Required Packages (if manual install)

```bash id="z82lsm"
npm install axios react-router-dom chart.js react-chartjs-2
```

---

## ▶️ Running the App

```bash id="l2k9sd"
npm start
```

* App runs on:

👉 http://localhost:3000

---

## 🔗 Backend Connection

Make sure your FastAPI backend is running at:

```bash id="d9x2kp"
http://127.0.0.1:8000
```

APIs used:

* `/data/{symbol}`
* `/stocks`
* `/topstocks`
* `/compare`

---

## 📊 Key Components Explained

### 🔹 ChartSection.js

* Main visualization component
* Handles:

  * Data fetching
  * Chart rendering
  * Prediction toggle
  * Metrics display

---

### 🔹 Sidebar.js

* Stock search + selection
* Dynamic filtering using backend API

---

### 🔹 Navbar.js

* Displays:

  * Top gainers
  * Top losers
* Navigation to home

---

### 🔹 ComparePage.js

* Compare two stocks
* Auto-fetch with debounce
* Shows:

  * Chart
  * Metrics
  * Correlation
  * Insights

---

## ⚠️ Notes

* Requires backend running (FastAPI)
* Works with NSE stocks (e.g., RELIANCE, TCS)
* Prediction depends on backend logic

---

## 💡 Future Improvements

* Add portfolio tracking
* Add user authentication
* Add real-time WebSocket updates
* Improve mobile responsiveness
* Add more advanced charts (candlestick, volume)

---

## 👨‍💻 Author

Greeshraj Patairiya

---

## ⭐ If you like this project

Give it a star ⭐ and feel free to contribute!
