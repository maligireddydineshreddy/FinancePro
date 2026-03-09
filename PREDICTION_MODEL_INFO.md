# Stock Prediction Model Information

## Current Implementation

### Algorithm Used:
- **AutoReg (Autoregressive Model)** from statsmodels library
- This is a **time series forecasting model** that uses past price data to predict future prices
- Uses 250 lags (250 previous days) to make predictions
- Trained on 90% of historical data, tested on 10%

### How It Works:
1. Fetches 2 years of historical stock price data
2. Trains on 90% of the data (AutoReg with 250 lags)
3. Tests on remaining 10% of data
4. Forecasts 90 days into the future

### Limitations:
- **Does NOT use sentiment analysis** for predictions
- **Does NOT consider:**
  - Market news/events
  - Company fundamentals
  - Economic indicators
  - Market sentiment
  - Volume analysis
- Only uses **historical price patterns**
- Can produce unrealistic predictions for volatile stocks
- Large price jumps (like 3% in one day) may not be realistic for stable stocks

## Sentiment Analysis:
- Sentiment analysis exists in the codebase (`/analyze_sentiment/` endpoint)
- BUT it is **NOT integrated** into stock predictions
- It's a separate feature for analyzing text sentiment only

## Improvements Needed:

### To Make Predictions More Realistic:

1. **Add Volatility Constraints:**
   - Limit daily price changes to realistic ranges (e.g., ±5% max per day)
   - Apply smoothing to predictions

2. **Integrate Sentiment Analysis:**
   - Scrape financial news
   - Analyze sentiment
   - Adjust predictions based on sentiment

3. **Use More Advanced Models:**
   - LSTM (Long Short-Term Memory) neural networks
   - ARIMA-GARCH models (accounts for volatility)
   - Ensemble methods combining multiple models

4. **Add Technical Indicators:**
   - Moving averages
   - RSI (Relative Strength Index)
   - MACD
   - Volume analysis

5. **Include External Factors:**
   - Market indices (NIFTY, SENSEX)
   - Sector performance
   - Economic indicators

## Current Status:
- ✅ Uses ML algorithm (AutoReg - statistical ML)
- ❌ Does NOT use sentiment analysis for predictions
- ⚠️ Predictions may be unrealistic for volatile periods
- ⚠️ No volatility constraints applied

