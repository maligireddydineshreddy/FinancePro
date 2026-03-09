# Finance App

A full-stack finance management application with React frontend, Node.js/Express backend, and Python FastAPI ML service.

## Project Structure

- `backend/` - Node.js/Express REST API with MongoDB
- `frontend/` - React + Vite frontend application
- `ml/` - Python FastAPI service for ML features (sentiment analysis, stock predictions)

## Prerequisites

- Node.js (v14 or higher)
- Python 3.13
- MongoDB Atlas account (or local MongoDB)

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on: **http://localhost:8000**

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:5173**

### 3. ML API Setup

```bash
cd ml
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn api:app --reload --port 8001
```

ML API runs on: **http://localhost:8001**

## Running All Services

You can run all three services simultaneously in separate terminal windows, or use a process manager like `concurrently` or `pm2`.

### Quick Start (All Services)

**Terminal 1 - Backend:**
```bash
cd backend && npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

**Terminal 3 - ML API:**
```bash
cd ml && source venv/bin/activate && uvicorn api:app --reload --port 8001
```

## API Endpoints

### Backend (Port 8000)
- `/api/users` - User management
- `/api/expenses` - Expense tracking
- `/api/savings` - Savings management
- `/api/bills` - Bills management

### ML API (Port 8001)
- `/analyze_sentiment/` - Sentiment analysis
- `/get_stock_info` - Stock information
- `/get_stock_prediction` - Stock predictions
- `/get_stocks` - Available stocks list

## Environment Notes

- MongoDB connection is configured in `backend/config/db.js`
- Frontend CORS is configured to allow requests from localhost:5173
- ML API CORS allows all origins (configure in production)

## Troubleshooting

1. **Port conflicts**: If ports 8000, 8001, or 5173 are in use, change them in respective config files
2. **Python dependencies**: Make sure virtual environment is activated before running ML API
3. **MongoDB**: Ensure MongoDB connection string in `backend/config/db.js` is correct

