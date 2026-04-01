from fastapi import FastAPI, Query
import pandas as pd
import yfinance as yf
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from fastapi.encoders import jsonable_encoder
from sklearn.linear_model import LinearRegression

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/data/{symbol}")
def get_stock(symbol: str):

    df = yf.download(f"{symbol}.NS", start="2023-01-01")

    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    if df.empty:
        return {"error": "Invalid symbol or no data found"}

    df = df.reset_index()
    df = df[['Date', 'Open', 'Close']]

    df = df.dropna()
    df = df[(df['Open'] > 0) & (df['Close'] > 0)]

    latest = df.iloc[-1]
    prev = df.iloc[-2] if len(df) > 1 else None

    if prev is not None:
        daily_return = ((latest["Close"] - prev["Close"]) / prev["Close"]) * 100
    else:
        daily_return = 0

    last7 = df['Close'].tail(7)
    ma7 = last7.mean() if len(last7) == 7 else None

    last252 = df.tail(252)
    closes252 = last252['Close']

    high52 = closes252.max()
    low52 = closes252.min()

    # Returns & Volatility
    df["returns"] = df["Close"].pct_change().fillna(0)

    volatility = df["returns"].std() * np.sqrt(252)

    if np.isnan(volatility) or np.isinf(volatility):
        volatility = 0

    vol_score = min(volatility * 100, 100)


    summary = {
        "latest_price": round(float(latest["Close"]), 2),
        "daily_return": round(float(daily_return), 2),
        "ma7": round(float(ma7), 2) if ma7 is not None else None,
        "high52": round(float(high52), 2),
        "low52": round(float(low52), 2),
        "volatility": float(volatility),
        "volatility_score": round(float(vol_score), 2)
    }


    df = df.replace([np.nan, np.inf, -np.inf], None)

    df["Date"] = df["Date"].astype(str)


    df_ml = df.copy().reset_index(drop=True)


    window = 30
    recent = df_ml.tail(window)

    # Calculate daily returns
    recent["returns"] = recent["Close"].pct_change().dropna()

    # Mean return (trend)
    mu = recent["returns"].mean()

    # Volatility (std)
    sigma = recent["returns"].std()

    # Last price
    last_price = recent["Close"].iloc[-1]

    future_days = 15
    predictions = []

    current_price = last_price

    np.random.seed(42)  # for consistency (optional)

    for _ in range(future_days):
        # random shock
        shock = np.random.normal(mu, sigma)

        # next price
        next_price = current_price * (1 + shock)

        predictions.append(next_price)
        current_price = next_price

    # Future dates
    last_date = pd.to_datetime(df_ml["Date"].iloc[-1])
    future_dates = pd.date_range(start=last_date, periods=future_days + 1, freq="B")[1:]

    prediction_data = [
        {
            "Date": str(date.date()),
            "Predicted_Close": float(pred)
        }
        for date, pred in zip(future_dates, predictions)
    ]
    return jsonable_encoder({
        "data": df.to_dict(orient="records"),
        "summary": summary,
        "prediction": prediction_data
    })


# 📈 STOCK LIST
ALL_STOCKS = [
    {"symbol": "RELIANCE", "name": "Reliance Industries"},
    {"symbol": "TCS", "name": "Tata Consultancy Services"},
    {"symbol": "INFY", "name": "Infosys"},
    {"symbol": "HDFCBANK", "name": "HDFC Bank"},
    {"symbol": "ICICIBANK", "name": "ICICI Bank"},
    {"symbol": "LT", "name": "Larsen & Toubro"},
    {"symbol": "SBIN", "name": "State Bank of India"},
]

# 🔍 SEARCH API
@app.get("/stocks")
def get_stocks(search: str = Query(default="")):

    if search == "":
        return ALL_STOCKS

    search = search.lower()

    return [
        stock for stock in ALL_STOCKS
        if search in stock["symbol"].lower()
        or search in stock["name"].lower()
    ]

from datetime import datetime, timedelta

@app.get('/topstocks')
def get_top_stocks():
    results = []

    for company in ALL_STOCKS:
        symbol = company["symbol"]
        name = company["name"]

        try:
            df = yf.download(f"{symbol}.NS", period="5d", interval="1d")

            if isinstance(df.columns, pd.MultiIndex):
                df.columns = df.columns.get_level_values(0)

            if df.empty or len(df) < 2:
                continue

            df = df.reset_index()

            # Take last 2 trading days
            latest = df.iloc[-1]
            prev = df.iloc[-2]

            latest_close = float(latest["Close"])
            prev_close = float(prev["Close"])

            change = latest_close - prev_close
            pct_change = (change / prev_close) * 100

            results.append({
                "symbol": symbol,
                "name": name,
                "price": round(latest_close, 2),
                "change": round(change, 2),
                "pct_change": round(pct_change, 2)
            })

        except Exception as e:
            print(f"Error fetching {symbol}: {e}")
            continue

    # Sort
    gainers = [x for x in results if x["pct_change"] > 0]
    losers = [x for x in results if x["pct_change"] < 0]

    gainers = sorted(results, key=lambda x: x["pct_change"], reverse=True)
    losers = sorted(results, key=lambda x: x["pct_change"])

    if len(gainers) == 0:
        # all stocks are down → show least losers as "gainers"
        gainers = sorted(results, key=lambda x: x["pct_change"], reverse=True)[:3]

    if len(losers) == 0:
        # all stocks are up → show smallest gain as "losers"
        losers = sorted(results, key=lambda x: x["pct_change"])[:3]

    return {
        "top_gainers": gainers[:3],
        "top_losers": losers[:3],
        "all": results
    }

def fetch_stock_data(symbol: str):
    df = yf.download(f"{symbol}.NS", start="2023-01-01")

    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    if df.empty:
        return None, None

    df = df.reset_index()[['Date', 'Close']]
    df = df.dropna()

    # Returns
    df["returns"] = df["Close"].pct_change().fillna(0)

    volatility = df["returns"].std() * np.sqrt(252)
    volatility = 0 if np.isnan(volatility) or np.isinf(volatility) else volatility

    # Total return
    ret = (df["Close"].iloc[-1] / df["Close"].iloc[0] - 1) * 100

    return df, {
        "return": float(ret),
        "volatility": float(volatility)
    }

@app.get("/compare")
def compare_stocks(symbol1: str, symbol2: str):

    df1, stats1 = fetch_stock_data(symbol1)
    df2, stats2 = fetch_stock_data(symbol2)

    if df1 is None or df2 is None:
        return {"error": "Invalid symbols"}

    # Rename BEFORE merge
    df1 = df1.rename(columns={"Close": symbol1})
    df2 = df2.rename(columns={"Close": symbol2})

    df = pd.merge(df1, df2, on="Date").dropna()

        # 📊 CORRELATION
    correlation = df[symbol1].pct_change().corr(df[symbol2].pct_change())

    # Clean value
    if np.isnan(correlation):
        correlation = 0

    correlation_percent = round(correlation * 100, 2)

    # Normalize
    df[f"{symbol1}_norm"] = df[symbol1] / df[symbol1].iloc[0] * 100
    df[f"{symbol2}_norm"] = df[symbol2] / df[symbol2].iloc[0] * 100

    # Insight
    better = symbol1 if stats1["return"] > stats2["return"] else symbol2

    chart_data = [
        {
            "Date": str(row["Date"].date()),
            symbol1: float(row[f"{symbol1}_norm"]),
            symbol2: float(row[f"{symbol2}_norm"])
        }
        for _, row in df.iterrows()
    ]

    if stats1["return"] > stats2["return"]:
        better = symbol1
    else:
        better = symbol2

    if stats1["volatility"] > stats2["volatility"]:
        riskier = symbol1
    else:
        riskier = symbol2

    insight = f"{better} gave better returns, while {riskier} was more volatile."

    return {
        "chart": chart_data,
        "summary": {
            symbol1: stats1,
            symbol2: stats2
        },
        "insight": insight,
        "correlation": correlation_percent
    }