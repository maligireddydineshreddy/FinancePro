from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pyfin_sentiment.model import SentimentModel
from pydantic import BaseModel
from datetime import datetime, timedelta
import os
import json
import hashlib
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from io import BytesIO
import yfinance as yf
from statsmodels.tsa.ar_model import AutoReg
import datetime as dt
import requests
import numpy as np

from fastapi.middleware.cors import CORSMiddleware
import os

# Get CORS origins from environment variable or use defaults
cors_origins_env = os.getenv("CORS_ORIGINS", "")
if cors_origins_env:
    origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
else:
    # Default: allow all origins (empty list means allow all in FastAPI)
    origins = []

# Global variables
file = "users_data.json"

# Cache for stocks list (loaded once, reused for performance)
_stocks_cache = None

# Lazy-loaded sentiment model (download/load on first use, not at startup)
_sentiment_model = None
_model_loading = False

def get_sentiment_model():
    """Lazy-load the sentiment model on first use to speed up server startup."""
    global _sentiment_model, _model_loading
    if _sentiment_model is None and not _model_loading:
        _model_loading = True
        try:
            model_size = os.getenv("SENTIMENT_MODEL_SIZE", "small")
            print(f"[Lazy Load] Downloading sentiment model ({model_size})...")
            SentimentModel.download(model_size)
            _sentiment_model = SentimentModel(model_size)
            print(f"[Lazy Load] Sentiment model loaded successfully")
        except Exception as e:
            print(f"[Lazy Load] Error loading sentiment model: {e}")
            _model_loading = False
    return _sentiment_model

app = FastAPI()

# CORS middleware - allow all origins by default, or specific origins if configured
# Empty origins list + allow_origin_regex=".*" allows all origins with credentials
if origins:
    # Specific origins configured - use them with credentials
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # No origins configured - allow all origins (for production flexibility)
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=".*",  # Allow all origins using regex
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.get("/health")
async def health_check():
    """Health check endpoint for warm-up pings and monitoring."""
    return {"status": "ok", "message": "ML API is running"}


class SentimentRequest(BaseModel):
    text: str

@app.post("/analyze_sentiment/")
async def analyze_sentiment(request: SentimentRequest):
    # Extract text from the request body
    statement = request.text
    
    if not statement:
        raise HTTPException(status_code=400, detail="No text provided for analysis.")
    
    model = get_sentiment_model()
    if model is None:
        raise HTTPException(status_code=503, detail="Sentiment model is still loading. Please try again in a moment.")
    
    # Predict sentiment for the entire text block
    sentiment = model.predict([statement])
    
    # Return the sentiment analysis result
    return {
        "text": statement,
        "predicted_sentiment": sentiment[0]
    }

# Data models
class Transaction(BaseModel):
    amount: float
    description: str
    category: str

class RecurringTransaction(BaseModel):
    amount: float
    description: str
    category: str
    interval_days: int

class Bill(BaseModel):
    title: str
    amount: float
    due_date: str
    paid: bool

class User(BaseModel):
    username: str
    password: str

class SavingsGoal(BaseModel):
    goal: float

class Budget(BaseModel):
    category: str
    amount: float

class Loan(BaseModel):
    loan_amount: float
    interest_rate: float
    duration_months: int

# Helper functions
def load_user_data(user):
    if os.path.exists(file):
        with open(file, "r") as f:
            data = json.load(f)
            user_data = data.get(user, {})
            return user_data
    return {}

def save_user_data(user, data):
    if os.path.exists(file):
        with open(file, "r") as f:
            all_data = json.load(f)
    else:
        all_data = {}

    all_data[user] = data
    with open(file, "w") as f:
        json.dump(all_data, f, indent=4)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def update_savings(user_data):
    user_data["savings"] = max(0, sum(t['amount'] for t in user_data.get('transactions', [])))
    return user_data

# Routes

@app.post("/signup/")
async def sign_up(user: User):
    data = {}
    if os.path.exists(file):
        with open(file, "r") as f:
            data = json.load(f)

    if user.username in data:
        raise HTTPException(status_code=400, detail="Username already exists!")
    
    data[user.username] = {"password": hash_password(user.password), "transactions": [], "recurring_transactions": [], "budget": {}, "savings_goal": 0.0, "savings": 0.0, "bills": []}
    save_user_data(user.username, data[user.username])
    return {"message": "Sign up successful!"}

@app.post("/login/")
async def login(user: User):
    if os.path.exists(file):
        with open(file, "r") as f:
            data = json.load(f)
        
        if user.username in data and data[user.username]["password"] == hash_password(user.password):
            return {"message": f"Welcome back, {user.username}!"}
        else:
            raise HTTPException(status_code=400, detail="Invalid credentials!")
    raise HTTPException(status_code=400, detail="User data not found!")

@app.post("/logout/")
async def logout():
    return {"message": "Logged out successfully!"}

@app.post("/add_transaction/")
async def add_transaction(user: str, transaction: Transaction):
    user_data = load_user_data(user)
    if not user_data:
        raise HTTPException(status_code=400, detail="User not found or not logged in!")

    user_data["transactions"].append(transaction.dict())
    user_data = update_savings(user_data)
    save_user_data(user, user_data)
    return {"message": "Transaction added successfully!"}

@app.post("/set_budget/")
async def set_budget(user: str, budget: Budget):
    user_data = load_user_data(user)
    if not user_data:
        raise HTTPException(status_code=400, detail="User not found or not logged in!")

    user_data["budget"][budget.category] = budget.amount
    save_user_data(user, user_data)
    return {"message": f"Budget for {budget.category} set to {budget.amount}"}

@app.get("/check_budget/")
async def check_budget(user: str):
    user_data = load_user_data(user)
    if not user_data:
        raise HTTPException(status_code=400, detail="User not found or not logged in!")
    
    budget_status = []
    for category, budget_amount in user_data["budget"].items():
        spent = sum(t['amount'] for t in user_data['transactions'] if t['category'] == category)
        budget_status.append({
            "category": category,
            "budget": budget_amount,
            "spent": spent,
            "status": "Exceeded" if abs(spent) >= budget_amount else "On Track" if abs(spent) < budget_amount else "Close to Exceeding"
        })

    return budget_status

@app.post("/add_recurring_transaction/")
async def add_recurring_transaction(user: str, recurring_transaction: RecurringTransaction):
    user_data = load_user_data(user)
    if not user_data:
        raise HTTPException(status_code=400, detail="User not found or not logged in!")

    next_date = datetime.now() + timedelta(days=recurring_transaction.interval_days)
    user_data["recurring_transactions"].append({
        'amount': recurring_transaction.amount, 
        'description': recurring_transaction.description, 
        'category': recurring_transaction.category, 
        'next_date': next_date.strftime("%Y-%m-%d %H:%M:%S"), 
        'interval_days': recurring_transaction.interval_days
    })
    save_user_data(user, user_data)
    return {"message": "Recurring transaction added successfully!"}

@app.post("/set_savings_goal/")
async def set_savings_goal(user: str, savings_goal: SavingsGoal):
    user_data = load_user_data(user)
    if not user_data:
        raise HTTPException(status_code=400, detail="User not found or not logged in!")

    user_data["savings_goal"] = savings_goal.goal
    save_user_data(user, user_data)
    return {"message": f"Savings goal set to {savings_goal.goal}"}

@app.get("/view_analytics/")
async def view_analytics(user: str):
    user_data = load_user_data(user)
    if not user_data:
        raise HTTPException(status_code=400, detail="User not found or not logged in!")

    transactions_df = pd.DataFrame(user_data["transactions"])
    if transactions_df.empty:
        raise HTTPException(status_code=400, detail="No transactions found.")

    income_df = transactions_df[transactions_df['amount'] > 0]
    expenditure_df = transactions_df[transactions_df['amount'] < 0]

    analytics = {}

    # Income and Expenditure by Category Pie Charts
    if not income_df.empty:
        income_summary = income_df.groupby('category')['amount'].sum().reset_index()
        analytics['income_pie'] = generate_pie_chart(income_summary, "Income by Category")

    if not expenditure_df.empty:
        expenditure_summary = expenditure_df.groupby('category')['amount'].sum().reset_index()
        analytics['expenditure_pie'] = generate_pie_chart(expenditure_summary, "Expenditure by Category")

    # Savings Progress
    update_savings(user_data)
    analytics['savings_progress'] = user_data["savings"]

    # Monthly Savings Over Time
    transactions_df['date'] = pd.to_datetime(transactions_df['date'])
    transactions_df['month'] = transactions_df['date'].dt.to_period('M')
    monthly_savings = transactions_df.groupby('month')['amount'].sum().reset_index()
    analytics['monthly_savings'] = monthly_savings

    return analytics

def generate_pie_chart(data, title):
    fig, ax = plt.subplots(figsize=(8, 8))
    ax.pie(data['amount'], labels=data['category'], autopct='%1.1f%%', startangle=90, colors=sns.color_palette('coolwarm', len(data)))
    ax.set_title(title)
    img = BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    return img.getvalue()

@app.post("/add_bill/")
async def add_bill(user: str, bill: Bill):
    user_data = load_user_data(user)
    if not user_data:
        raise HTTPException(status_code=400, detail="User not found or not logged in!")

    user_data["bills"].append({
        'title': bill.title, 
        'amount': bill.amount, 
        'due_date': bill.due_date, 
        'status': "Paid" if bill.paid else "Pending", 
        'date_added': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })
    save_user_data(user, user_data)
    return {"message": "Bill added successfully!"}

@app.get("/view_bills/")
async def view_bills(user: str):
    user_data = load_user_data(user)
    if not user_data:
        raise HTTPException(status_code=400, detail="User not found or not logged in!")

    return user_data["bills"]

@app.post("/mark_bill_as_paid/")
async def mark_bill_as_paid(user: str, bill_title: str):
    user_data = load_user_data(user)
    if not user_data:
        raise HTTPException(status_code=400, detail="User not found or not logged in!")

    for bill in user_data["bills"]:
        if bill['title'] == bill_title:
            bill['status'] = "Paid"
            save_user_data(user, user_data)
            return {"message": f"Bill '{bill_title}' marked as paid."}
    raise HTTPException(status_code=404, detail="Bill not found!")

def fetch_stocks():
    """
    Fetch stocks list with caching for performance.
    Caches the result in memory to avoid re-reading CSV on every request.
    """
    global _stocks_cache
    
    # Return cached result if available (much faster!)
    if _stocks_cache is not None:
        return _stocks_cache
    
    try:
        # Try to load from data directory first
        import os
        csv_path = os.path.join(os.path.dirname(__file__), "data", "equity_issuers.csv")
        
        if os.path.exists(csv_path):
            df = pd.read_csv(csv_path)
            # Filter the data
            df = df[["Security Code", "Issuer Name"]]
            # Create a dictionary
            stock_dict = dict(zip(df["Security Code"], df["Issuer Name"]))
            # Cache the result
            _stocks_cache = stock_dict
            return stock_dict
        else:
            # If file doesn't exist, return a default list of popular Indian stocks
            print(f"Warning: {csv_path} not found. Using default stock list.")
            default_stocks = {
                "RELIANCE": "Reliance Industries Ltd",
                "TCS": "Tata Consultancy Services Ltd",
                "HDFCBANK": "HDFC Bank Ltd",
                "INFY": "Infosys Ltd",
                "ICICIBANK": "ICICI Bank Ltd",
                "HINDUNILVR": "Hindustan Unilever Ltd",
                "SBIN": "State Bank of India",
                "BHARTIARTL": "Bharti Airtel Ltd",
                "ITC": "ITC Ltd",
                "KOTAKBANK": "Kotak Mahindra Bank Ltd",
                "LT": "Larsen & Toubro Ltd",
                "AXISBANK": "Axis Bank Ltd",
                "HCLTECH": "HCL Technologies Ltd",
                "ASIANPAINT": "Asian Paints Ltd",
                "MARUTI": "Maruti Suzuki India Ltd",
                "TITAN": "Titan Company Ltd",
                "SUNPHARMA": "Sun Pharmaceutical Industries Ltd",
                "BAJFINANCE": "Bajaj Finance Ltd",
                "WIPRO": "Wipro Ltd",
                "NESTLEIND": "Nestle India Ltd"
            }
            # Cache the default stocks
            _stocks_cache = default_stocks
            return default_stocks
    except Exception as e:
        print(f"Error loading stocks: {e}")
        # Return default stocks if CSV loading fails
        default_stocks = {
            "RELIANCE": "Reliance Industries Ltd",
            "TCS": "Tata Consultancy Services Ltd",
            "HDFCBANK": "HDFC Bank Ltd",
            "INFY": "Infosys Ltd",
            "ICICIBANK": "ICICI Bank Ltd",
            "HINDUNILVR": "Hindustan Unilever Ltd",
            "SBIN": "State Bank of India",
            "BHARTIARTL": "Bharti Airtel Ltd",
            "ITC": "ITC Ltd",
            "KOTAKBANK": "Kotak Mahindra Bank Ltd",
            "LT": "Larsen & Toubro Ltd",
            "AXISBANK": "Axis Bank Ltd",
            "HCLTECH": "HCL Technologies Ltd",
            "ASIANPAINT": "Asian Paints Ltd",
            "MARUTI": "Maruti Suzuki India Ltd",
            "TITAN": "Titan Company Ltd",
            "SUNPHARMA": "Sun Pharmaceutical Industries Ltd",
            "BAJFINANCE": "Bajaj Finance Ltd",
            "WIPRO": "Wipro Ltd",
            "NESTLEIND": "Nestle India Ltd"
        }
        # Cache the default stocks
        _stocks_cache = default_stocks
        return default_stocks


# Create function to fetch periods and intervals
def fetch_periods_intervals():
    # Create dictionary for periods and intervals
    periods = {
        "1d": ["1m", "2m", "5m", "15m", "30m", "60m", "90m"],
        "5d": ["1m", "2m", "5m", "15m", "30m", "60m", "90m"],
        "1mo": ["30m", "60m", "90m", "1d"],
        "3mo": ["1d", "5d", "1wk", "1mo"],
        "6mo": ["1d", "5d", "1wk", "1mo"],
        "1y": ["1d", "5d", "1wk", "1mo"],
        "2y": ["1d", "5d", "1wk", "1mo"],
        "5y": ["1d", "5d", "1wk", "1mo"],
        "10y": ["1d", "5d", "1wk", "1mo"],
        "max": ["1d", "5d", "1wk", "1mo"],
    }

    # Return the dictionary
    return periods


# Function to fetch the stock info
def fetch_stock_info(stock_ticker):
    # Pull the data for the first security
    stock_data = yf.Ticker(stock_ticker)

    # Extract full of the stock
    stock_data_info = stock_data.info

    # Function to safely get value from dictionary or return "N/A"
    def safe_get(data_dict, key):
        return data_dict.get(key, "N/A")

    # Extract only the important information
    stock_data_info = {
        "Basic Information": {
            "symbol": safe_get(stock_data_info, "symbol"),
            "longName": safe_get(stock_data_info, "longName"),
            "currency": safe_get(stock_data_info, "currency"),
            "exchange": safe_get(stock_data_info, "exchange"),
        },
        "Market Data": {
            "currentPrice": safe_get(stock_data_info, "currentPrice"),
            "previousClose": safe_get(stock_data_info, "previousClose"),
            "open": safe_get(stock_data_info, "open"),
            "dayLow": safe_get(stock_data_info, "dayLow"),
            "dayHigh": safe_get(stock_data_info, "dayHigh"),
            "regularMarketPreviousClose": safe_get(
                stock_data_info, "regularMarketPreviousClose"
            ),
            "regularMarketOpen": safe_get(stock_data_info, "regularMarketOpen"),
            "regularMarketDayLow": safe_get(stock_data_info, "regularMarketDayLow"),
            "regularMarketDayHigh": safe_get(stock_data_info, "regularMarketDayHigh"),
            "fiftyTwoWeekLow": safe_get(stock_data_info, "fiftyTwoWeekLow"),
            "fiftyTwoWeekHigh": safe_get(stock_data_info, "fiftyTwoWeekHigh"),
            "fiftyDayAverage": safe_get(stock_data_info, "fiftyDayAverage"),
            "twoHundredDayAverage": safe_get(stock_data_info, "twoHundredDayAverage"),
        },
        "Volume and Shares": {
            "volume": safe_get(stock_data_info, "volume"),
            "regularMarketVolume": safe_get(stock_data_info, "regularMarketVolume"),
            "averageVolume": safe_get(stock_data_info, "averageVolume"),
            "averageVolume10days": safe_get(stock_data_info, "averageVolume10days"),
            "averageDailyVolume10Day": safe_get(
                stock_data_info, "averageDailyVolume10Day"
            ),
            "sharesOutstanding": safe_get(stock_data_info, "sharesOutstanding"),
            "impliedSharesOutstanding": safe_get(
                stock_data_info, "impliedSharesOutstanding"
            ),
            "floatShares": safe_get(stock_data_info, "floatShares"),
        },
        "Dividends and Yield": {
            "dividendRate": safe_get(stock_data_info, "dividendRate"),
            "dividendYield": safe_get(stock_data_info, "dividendYield"),
            "payoutRatio": safe_get(stock_data_info, "payoutRatio"),
        },
        "Valuation and Ratios": {
            "marketCap": safe_get(stock_data_info, "marketCap"),
            "enterpriseValue": safe_get(stock_data_info, "enterpriseValue"),
            "priceToBook": safe_get(stock_data_info, "priceToBook"),
            "debtToEquity": safe_get(stock_data_info, "debtToEquity"),
            "grossMargins": safe_get(stock_data_info, "grossMargins"),
            "profitMargins": safe_get(stock_data_info, "profitMargins"),
        },
        "Financial Performance": {
            "totalRevenue": safe_get(stock_data_info, "totalRevenue"),
            "revenuePerShare": safe_get(stock_data_info, "revenuePerShare"),
            "totalCash": safe_get(stock_data_info, "totalCash"),
            "totalCashPerShare": safe_get(stock_data_info, "totalCashPerShare"),
            "totalDebt": safe_get(stock_data_info, "totalDebt"),
            "earningsGrowth": safe_get(stock_data_info, "earningsGrowth"),
            "revenueGrowth": safe_get(stock_data_info, "revenueGrowth"),
            "returnOnAssets": safe_get(stock_data_info, "returnOnAssets"),
            "returnOnEquity": safe_get(stock_data_info, "returnOnEquity"),
        },
        "Cash Flow": {
            "freeCashflow": safe_get(stock_data_info, "freeCashflow"),
            "operatingCashflow": safe_get(stock_data_info, "operatingCashflow"),
        },
        "Analyst Targets": {
            "targetHighPrice": safe_get(stock_data_info, "targetHighPrice"),
            "targetLowPrice": safe_get(stock_data_info, "targetLowPrice"),
            "targetMeanPrice": safe_get(stock_data_info, "targetMeanPrice"),
            "targetMedianPrice": safe_get(stock_data_info, "targetMedianPrice"),
        },
    }

    # Return the stock data
    return stock_data_info

class StockRequest(BaseModel):
    stock: str
    stock_exchange: str

# Endpoint to get stock data based on user input
@app.post("/get_stock_info", response_model=dict)
async def get_stock_info(request: StockRequest):
    stock_dict = fetch_stocks()
    
    # Check if the stock exists in the available list
    if request.stock not in stock_dict:
        raise HTTPException(status_code=400, detail="Invalid stock selected")
    
    # Build the stock ticker based on the exchange selected
    stock_ticker = f"{stock_dict[request.stock]}.{'BO' if request.stock_exchange == 'BSE' else 'NS'}"
    
    # Fetch the stock info from the API
    try:
        stock_data_info = fetch_stock_info(stock_ticker)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stock data: {str(e)}")
    
    # Build the response structure with headings and stock data
    response = {
        "Basic Information": {
            "Issuer Name": stock_data_info["Basic Information"]["longName"],
            "Currency": stock_data_info["Basic Information"]["currency"],
            "Exchange": request.stock_exchange,
            "Symbol": stock_ticker
        },
        "Market Data": {
            "Current Price": stock_data_info["Market Data"]["currentPrice"],
            "Previous Close": stock_data_info["Market Data"]["previousClose"],
            "Open": stock_data_info["Market Data"]["open"],
            "Day Low": stock_data_info["Market Data"]["dayLow"],
            "Day High": stock_data_info["Market Data"]["dayHigh"],
            "52 Week Low": stock_data_info["Market Data"]["fiftyTwoWeekLow"],
            "52 Week High": stock_data_info["Market Data"]["fiftyTwoWeekHigh"],
            "50-Day Average": stock_data_info["Market Data"]["fiftyDayAverage"]
        },
        "Volume and Shares": {
            "Volume": stock_data_info["Volume and Shares"]["volume"],
            "Regular Market Volume": stock_data_info["Volume and Shares"]["regularMarketVolume"],
            "Shares Outstanding": stock_data_info["Volume and Shares"]["sharesOutstanding"],
            "Implied Shares Outstanding": stock_data_info["Volume and Shares"]["impliedSharesOutstanding"],
            "Float Shares": stock_data_info["Volume and Shares"]["floatShares"]
        },
        "Dividends and Yield": {
            "Dividend Rate": stock_data_info["Dividends and Yield"]["dividendRate"],
            "Dividend Yield": stock_data_info["Dividends and Yield"]["dividendYield"],
            "Payout Ratio": stock_data_info["Dividends and Yield"]["payoutRatio"]
        },
        "Valuation and Ratios": {
            "Market Cap": stock_data_info["Valuation and Ratios"]["marketCap"],
            "Enterprise Value": stock_data_info["Valuation and Ratios"]["enterpriseValue"],
            "Price to Book": stock_data_info["Valuation and Ratios"]["priceToBook"],
            "Debt to Equity": stock_data_info["Valuation and Ratios"]["debtToEquity"],
            "Gross Margins": stock_data_info["Valuation and Ratios"]["grossMargins"],
            "Profit Margins": stock_data_info["Valuation and Ratios"]["profitMargins"]
        },
        "Financial Performance": {
            "Total Revenue": stock_data_info["Financial Performance"]["totalRevenue"],
            "Revenue Per Share": stock_data_info["Financial Performance"]["revenuePerShare"],
            "Total Cash": stock_data_info["Financial Performance"]["totalCash"],
            "Total Debt": stock_data_info["Financial Performance"]["totalDebt"],
            "Earnings Growth": stock_data_info["Financial Performance"]["earningsGrowth"],
            "Revenue Growth": stock_data_info["Financial Performance"]["revenueGrowth"],
            "Return on Assets": stock_data_info["Financial Performance"]["returnOnAssets"],
            "Return on Equity": stock_data_info["Financial Performance"]["returnOnEquity"]
        },
        "Cash Flow": {
            "Free Cash Flow": stock_data_info["Cash Flow"]["freeCashflow"],
            "Operating Cash Flow": stock_data_info["Cash Flow"]["operatingCashflow"]
        },
        "Analyst Targets": {
            "Target High Price": stock_data_info["Analyst Targets"]["targetHighPrice"],
            "Target Low Price": stock_data_info["Analyst Targets"]["targetLowPrice"],
            "Target Mean Price": stock_data_info["Analyst Targets"]["targetMeanPrice"],
            "Target Median Price": stock_data_info["Analyst Targets"]["targetMedianPrice"]
        }
    }
    
    return response

def fetch_stock_history(stock_ticker, period, interval):
    # Pull the data for the first security
    stock_data = yf.Ticker(stock_ticker)

    # Extract full of the stock
    stock_data_history = stock_data.history(period=period, interval=interval)[
        ["Open", "High", "Low", "Close"]
    ]

    # Return the stock data
    return stock_data_history

def fetch_stock_news(stock_ticker, stock_name, max_articles=10):
    """
    Fetch recent financial news articles for a stock and analyze sentiment.
    Returns average sentiment score (-1 to 1, where -1 is negative, 0 is neutral, 1 is positive)
    """
    try:
        # Use yfinance to get news
        stock = yf.Ticker(stock_ticker)
        news_list = stock.news[:max_articles]  # Get recent news
        
        if not news_list:
            return 0.0, []  # Neutral sentiment if no news
        
        sentiments = []
        news_with_sentiment = []
        
        for news_item in news_list:
            # Handle both old and new yfinance news formats
            # New format: news_item['content']['title'] and news_item['content']['summary']
            # Old format: news_item['title'] and news_item['summary']
            content = news_item.get('content', {})
            if isinstance(content, dict):
                title = content.get('title', '') or news_item.get('title', '')
                summary = content.get('summary', '') or news_item.get('summary', '') or ''
            else:
                title = news_item.get('title', '')
                summary = news_item.get('summary', '') or ''
            
            text_to_analyze = f"{title} {summary}".strip()
            
            if text_to_analyze:
                try:
                    model = get_sentiment_model()
                    if model is None:
                        # Fallback to keyword-based if model not loaded
                        raise Exception("Model not loaded yet")
                    # Analyze sentiment using pyfin-sentiment model
                    sentiment_result = model.predict([text_to_analyze])[0]
                    
                    # Convert sentiment to numeric score
                    # pyfin-sentiment returns numpy array with string labels: '1' (positive), '-1' (negative), '0' (neutral)
                    sentiment_score = 0.0
                    sentiment_label = 'neutral'
                    
                    # Convert result to string for processing
                    sentiment_str = str(sentiment_result).strip()
                    
                    # pyfin-sentiment mapping: '1' = positive, '3' = negative, '0' or '2' = neutral
                    if sentiment_str == '1' or sentiment_str == '1.0':
                        # Positive sentiment
                        sentiment_score = 0.5
                        sentiment_label = 'positive'
                    elif sentiment_str == '3' or sentiment_str == '3.0' or sentiment_str == '-1' or sentiment_str == '-1.0':
                        # Negative sentiment
                        sentiment_score = -0.5
                        sentiment_label = 'negative'
                    elif sentiment_str == '0' or sentiment_str == '0.0' or sentiment_str == '2' or sentiment_str == '2.0':
                        # Neutral sentiment
                        sentiment_score = 0.0
                        sentiment_label = 'neutral'
                    elif isinstance(sentiment_result, dict):
                        # If it's a dict, extract score and label
                        sentiment_label = sentiment_result.get('label', 'neutral').lower()
                        score_val = sentiment_result.get('score', 0.0)
                        sentiment_score = float(score_val) if score_val is not None else 0.0
                    elif isinstance(sentiment_result, str):
                        # If it's a string label, map to numeric score
                        sentiment_label = sentiment_result.lower()
                        if 'positive' in sentiment_label or 'bullish' in sentiment_label or sentiment_label == '1':
                            sentiment_score = 0.5
                            sentiment_label = 'positive'
                        elif 'negative' in sentiment_label or 'bearish' in sentiment_label or sentiment_label == '-1':
                            sentiment_score = -0.5
                            sentiment_label = 'negative'
                        else:
                            sentiment_score = 0.0
                            sentiment_label = 'neutral'
                    elif isinstance(sentiment_result, (int, float)):
                        # If it's a numeric value directly
                        sentiment_score = float(sentiment_result)
                        sentiment_score = max(-1.0, min(1.0, sentiment_score))  # Clamp to [-1, 1]
                        sentiment_label = 'positive' if sentiment_score > 0.1 else ('negative' if sentiment_score < -0.1 else 'neutral')
                    else:
                        # Fallback: Use keyword-based sentiment analysis
                        text_lower = text_to_analyze.lower()
                        positive_words = ['surge', 'rise', 'gain', 'profit', 'growth', 'strong', 'up', 'bullish', 'positive', 'beat', 'outperform', 'increase', 'higher', 'success', 'exceed', 'soar', 'jump', 'rally']
                        negative_words = ['fall', 'drop', 'decline', 'loss', 'weak', 'down', 'bearish', 'negative', 'miss', 'underperform', 'crash', 'decrease', 'lower', 'fail', 'plunge', 'sink', 'tumble']
                        
                        pos_count = sum(1 for word in positive_words if word in text_lower)
                        neg_count = sum(1 for word in negative_words if word in text_lower)
                        
                        if pos_count > neg_count:
                            sentiment_score = 0.4
                            sentiment_label = 'positive'
                        elif neg_count > pos_count:
                            sentiment_score = -0.4
                            sentiment_label = 'negative'
                        else:
                            sentiment_score = 0.0
                            sentiment_label = 'neutral'
                    
                    # Ensure sentiment score is in valid range
                    sentiment_score = max(-1.0, min(1.0, sentiment_score))
                    
                    # Get link - check both new and old formats
                    link = ''
                    if 'canonicalUrl' in news_item and isinstance(news_item['canonicalUrl'], dict):
                        link = news_item['canonicalUrl'].get('url', '')
                    elif 'clickThroughUrl' in news_item and isinstance(news_item['clickThroughUrl'], dict):
                        link = news_item['clickThroughUrl'].get('url', '')
                    else:
                        link = news_item.get('link', '') or news_item.get('url', '')
                    
                    sentiments.append(sentiment_score)
                    news_with_sentiment.append({
                        'title': title,
                        'link': link,
                        'sentiment_score': round(sentiment_score, 3),
                        'sentiment_label': sentiment_label
                    })
                except Exception as e:
                    print(f"Error analyzing sentiment for news: {e}")
                    import traceback
                    traceback.print_exc()
                    # Continue with next article
                    continue
        
        # Calculate average sentiment
        avg_sentiment = float(np.mean(sentiments)) if sentiments else 0.0
        avg_sentiment = max(-1.0, min(1.0, avg_sentiment))  # Clamp to [-1, 1]
        
        return avg_sentiment, news_with_sentiment
    
    except Exception as e:
        print(f"Error fetching news: {e}")
        import traceback
        traceback.print_exc()
        return 0.0, []

def apply_sentiment_adjustment(base_forecast, sentiment_score, volatility_factor=0.02):
    """
    Adjust forecast based on sentiment analysis.
    sentiment_score: -1 (very negative) to 1 (very positive)
    volatility_factor: Maximum percentage adjustment (default 2%)
    """
    adjustment_factor = sentiment_score * volatility_factor
    adjusted_forecast = base_forecast * (1 + adjustment_factor)
    return adjusted_forecast

def generate_stock_prediction(stock_ticker, stock_name=None):
    # Try to generate the predictions
    try:
        # Pull the data for the first security
        stock_data = yf.Ticker(stock_ticker)

        # Extract the data for last 1yr with 1d interval
        stock_data_hist = stock_data.history(period="2y", interval="1d")

        # Clean the data for to keep only the required columns
        stock_data_close = stock_data_hist[["Close"]]

        # Change frequency to day
        stock_data_close = stock_data_close.asfreq("D", method="ffill")

        # Fill missing values
        stock_data_close = stock_data_close.ffill()

        # Define training and testing area
        train_df = stock_data_close.iloc[: int(len(stock_data_close) * 0.9) + 1]  # 90%
        test_df = stock_data_close.iloc[int(len(stock_data_close) * 0.9) :]  # 10%

        # Define training model
        ar_model = AutoReg(train_df["Close"], 250).fit(cov_type="HC0")

        # Predict data for test data
        predictions = ar_model.predict(
            start=test_df.index[0], end=test_df.index[-1], dynamic=True
        )

        # Predict 90 days into the future (base forecast)
        base_forecast = ar_model.predict(
            start=test_df.index[0],
            end=test_df.index[-1] + dt.timedelta(days=90),
            dynamic=True,
        )
        
        # Fetch news and analyze sentiment
        if stock_name:
            sentiment_score, news_articles = fetch_stock_news(stock_ticker, stock_name)
        else:
            sentiment_score = 0.0
            news_articles = []
        
        # --- Build a realistic forecast with mean-reversion + noise ---
        # The raw AutoReg forecast diverges unnaturally. Instead, we use:
        # 1. The model's predicted direction (trend bias)
        # 2. Mean-reversion toward historical moving average
        # 3. Realistic daily volatility from actual returns
        
        test_end_date = test_df.index[-1]
        last_price = test_df["Close"].iloc[-1]
        
        # Calculate historical volatility from actual daily returns
        daily_returns = stock_data_close["Close"].pct_change().dropna()
        hist_volatility = daily_returns.std()  # Typical: 0.01-0.03 (1-3%)
        # Cap volatility to prevent extreme swings
        hist_volatility = min(hist_volatility, 0.025)
        
        # Calculate mean-reversion target (90-day moving average)
        ma_90 = stock_data_close["Close"].rolling(90).mean().iloc[-1]
        
        # Get the AutoReg model's overall trend direction for 90 days
        raw_90d_change = (base_forecast.iloc[-1] - last_price) / last_price
        # Limit the total 90-day drift to ±8% max
        total_drift = max(-0.08, min(0.08, raw_90d_change))
        daily_drift = total_drift / 90  # Spread evenly
        
        # Apply sentiment to adjust the drift
        sentiment_drift = sentiment_score * 0.0003  # Subtle: max ±0.03% per day
        daily_drift += sentiment_drift
        # Cap daily drift
        daily_drift = max(-0.0005, min(0.0005, daily_drift))
        
        # Build the adjusted forecast
        adjusted_forecast = base_forecast.copy()
        
        np.random.seed(42)  # Reproducible noise
        current_price = last_price
        
        for i, date in enumerate(adjusted_forecast.index):
            if date <= test_end_date:
                # Keep the test period predictions from AutoReg as-is
                continue
            
            days_ahead = (date - test_end_date).days
            
            # Mean-reversion pull toward MA (stronger as price deviates more)
            deviation_from_ma = (current_price - ma_90) / ma_90
            mean_reversion = -deviation_from_ma * 0.02  # 2% pull toward MA per day
            
            # Sentiment decays over time
            time_decay = max(0.1, 1.0 - (days_ahead / 90.0))
            daily_sentiment = sentiment_drift * time_decay
            
            # Daily return = drift + mean_reversion + sentiment + random noise
            noise = np.random.normal(0, hist_volatility * 0.6)  # Damped noise
            daily_return = daily_drift + mean_reversion + daily_sentiment + noise
            
            # Clamp daily return to ±3% (realistic daily limit)
            daily_return = max(-0.03, min(0.03, daily_return))
            
            # Update price
            current_price = current_price * (1 + daily_return)
            
            # Ensure price doesn't deviate more than ±15% from last historical price
            max_price = last_price * 1.15
            min_price = last_price * 0.85
            current_price = max(min_price, min(max_price, current_price))
            
            adjusted_forecast.iloc[i] = current_price

        # Return the required data with sentiment info
        return train_df, test_df, adjusted_forecast, predictions, sentiment_score, news_articles

    # If error occurs
    except Exception as e:
        print(f"Error in generate_stock_prediction: {e}")
        return None, None, None, None, None, None

class StockRequest(BaseModel):
    stock: str
    stock_exchange: str
    period: str
    interval: str

# Endpoint to get stock data and predictions
@app.post("/get_stock_prediction", response_model=dict)
async def get_stock_prediction(request: StockRequest):
    stock_dict = fetch_stocks()
    
    # Check if the stock exists in the available list
    if request.stock not in stock_dict:
        raise HTTPException(status_code=400, detail="Invalid stock selected")
    
    # Build the stock ticker based on the exchange selected
    stock_ticker = f"{stock_dict[request.stock]}.{'BO' if request.stock_exchange == 'BSE' else 'NS'}"
    
    # Fetch stock data (historical)
    try:
        stock_data = fetch_stock_history(stock_ticker, request.period, request.interval)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching stock data: {str(e)}")
    
    if stock_data.empty:
        raise HTTPException(status_code=404, detail="No data found for the selected stock")
    
    # Get stock name for news fetching
    stock_info = yf.Ticker(stock_ticker)
    stock_name = stock_info.info.get('longName', request.stock)
    
    # Fetch stock prediction (train, test, forecast, predictions) with sentiment
    train_df, test_df, forecast, predictions, sentiment_score, news_articles = generate_stock_prediction(stock_ticker, stock_name)

    # Check if predictions are valid
    if train_df is None or (forecast is None) or (predictions is None):
        raise HTTPException(status_code=500, detail="Error generating stock predictions")

    # Prepare the response structure
    response = {
        "historical_data": {
            "dates": stock_data.index.tolist(),
            "open": stock_data["Open"].tolist(),
            "high": stock_data["High"].tolist(),
            "low": stock_data["Low"].tolist(),
            "close": stock_data["Close"].tolist(),
        },
        "stock_prediction": {
            "train_dates": train_df.index.tolist(),
            "train_close": train_df["Close"].tolist(),
            "test_dates": test_df.index.tolist(),
            "test_close": test_df["Close"].tolist(),
            "forecast_dates": forecast.index.tolist(),
            "forecast": forecast.tolist(),
            "test_predictions_dates": test_df.index.tolist(),
            "test_predictions": predictions.tolist(),
        },
        "sentiment_analysis": {
            "overall_sentiment_score": float(sentiment_score) if sentiment_score is not None else 0.0,
            "sentiment_label": "positive" if (sentiment_score and sentiment_score > 0.1) else ("negative" if (sentiment_score and sentiment_score < -0.1) else "neutral"),
            "news_count": len(news_articles) if news_articles else 0,
            "recent_news": news_articles[:5] if news_articles else []  # Top 5 news items
        }
    }



    
    return response

@app.post("/get_stocks", response_model=dict)
async def get_stocks():
    stock_dict = fetch_stocks()
    stocks = list(stock_dict.keys())
    output = {
        "stocks": stocks}
    return output


# Keep-alive: Prevent Render free-tier from sleeping
import threading
import urllib.request

def keep_alive():
    """Background thread that pings the health endpoint every 14 minutes."""
    import time
    port = int(os.getenv("PORT", 8000))
    url = os.getenv("RENDER_EXTERNAL_URL", f"http://localhost:{port}")
    while True:
        time.sleep(14 * 60)  # 14 minutes
        try:
            urllib.request.urlopen(f"{url}/health", timeout=5)
            print("[Keep-Alive] Health ping successful")
        except Exception as e:
            print(f"[Keep-Alive] Ping failed: {e}")

if os.getenv("RENDER") or os.getenv("ENVIRONMENT") == "production":
    keep_alive_thread = threading.Thread(target=keep_alive, daemon=True)
    keep_alive_thread.start()
    print("[Keep-Alive] Background thread started (every 14 min)")

# Preload sentiment model in background thread so it's ready when needed
def preload_model():
    """Load the sentiment model in background so server starts fast."""
    import time
    time.sleep(2)  # Wait for server to finish starting
    get_sentiment_model()

preload_thread = threading.Thread(target=preload_model, daemon=True)
preload_thread.start()
