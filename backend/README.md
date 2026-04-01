# 📊 Stock Market Analysis & Prediction API

A FastAPI-based backend that provides stock data, analytics, comparison, and short-term price prediction using historical data.

---

## 🚀 Features

### 📈 Stock Data API

* Fetch historical stock data (Open, Close)
* Daily return calculation
* 7-day moving average
* 52-week high & low
* Volatility & volatility score

---

### 🤖 Price Prediction

* Generates next **15-day predicted prices**
* Uses:

  * Mean return (trend)
  * Volatility (standard deviation)
  * Monte Carlo-style simulation

---

### 🔍 Stock Search API

* Search stocks by:

  * Symbol (e.g., RELIANCE)
  * Name (e.g., Infosys)

---

### 🏆 Top Gainers & Losers

* Fetches:

  * Top 3 gainers
  * Top 3 losers
* Based on last trading day performance

---

### ⚖️ Stock Comparison

* Compare two stocks based on:

  * Returns
  * Volatility
  * Correlation
* Normalized chart data for frontend visualization
* Insight generation (better performer & riskier stock)

---

## 🧠 Tech Stack

* **Backend**: FastAPI
* **Data Source**: yfinance
* **Data Processing**: Pandas, NumPy
* **ML Logic**: Statistical simulation (returns + volatility)
* **CORS**: Enabled for frontend integration

---

## 📦 Installation

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

---

### 2️⃣ Create Virtual Environment (Recommended)

```bash
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows
```

---

### 3️⃣ Install Dependencies

```bash
pip install fastapi uvicorn pandas numpy yfinance scikit-learn
```

---

## ▶️ Running the Server

```bash
uvicorn main:app --reload
```

* `main` = filename (change if your file name is different)
* Server will start at:

👉 http://127.0.0.1:8000

---

## 📡 API Endpoints

### 🔹 1. Get Stock Data

```
GET /data/{symbol}
```

Example:

```
/data/RELIANCE
```

Returns:

* Historical data
* Summary stats
* 15-day prediction

---

### 🔹 2. Search Stocks

```
GET /stocks?search=infy
```

---

### 🔹 3. Top Gainers & Losers

```
GET /topstocks
```

---

### 🔹 4. Compare Stocks

```
GET /compare?symbol1=RELIANCE&symbol2=TCS
```

Returns:

* Normalized chart data
* Returns & volatility
* Correlation
* Insight

---

## 📊 How Prediction Works (Simple Explanation)

1. Take last **30 days of returns**
2. Calculate:

   * Average return (trend)
   * Volatility (risk)
3. Simulate future prices using:

```
Next Price = Current Price × (1 + Random Shock)
```

4. Repeat for 15 days

---

## ⚠️ Notes

* Uses **Yahoo Finance API (yfinance)** → requires internet
* Only supports **NSE stocks** (`.NS` suffix automatically added)
* Prediction is **not financial advice** — just a statistical simulation

---

## 💡 Future Improvements

* Add LSTM / ML models
* Add caching for faster API responses
* Add database support (PostgreSQL)
* Add authentication
* Deploy on Render / AWS

---

## 👨‍💻 Author

Greeshraj Patairiya

---

## ⭐ If you like this project

Give it a star ⭐ and feel free to contribute!
