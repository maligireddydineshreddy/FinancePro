// Import required dependencies
require("dotenv").config(); // Load environment variables
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors"); // Import CORS middleware
const bodyParser = require("body-parser"); // Import body-parser

// Import routes
const userRoutes = require("./routes/UserRoutes");
const expenseRoutes = require("./routes/ExpenseRoutes");
const savingsRoutes = require("./routes/SavingsRoutes");
const billsRoutes = require("./routes/BillsRoute");

// Create an Express application
const app = express();

// Connect to the database
connectDB();

// Define a port (changed from 8000 to avoid conflict with ML API on 8000)
const PORT = process.env.PORT || 3001;

// CORS configuration - Allow all origins for simplicity
// This fixes CORS issues in production
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json()); // Use body-parser to parse JSON
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint for keeping service alive
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "FinancePro backend is running" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "FinancePro backend API is running" });
});

// Use the routes
app.use("/api/users", userRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/savings", savingsRoutes);
app.use("/api/bills", billsRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Keep-alive: Ping self every 14 minutes to prevent Render free-tier cold starts
  if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
    const SELF_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    setInterval(async () => {
      try {
        const http = require('http');
        const https = require('https');
        const client = SELF_URL.startsWith('https') ? https : http;
        client.get(`${SELF_URL}/health`, (res) => {
          console.log(`[Keep-Alive] Pinged /health — Status: ${res.statusCode}`);
        }).on('error', (err) => {
          console.error('[Keep-Alive] Ping failed:', err.message);
        });
      } catch (err) {
        console.error('[Keep-Alive] Error:', err.message);
      }
    }, 14 * 60 * 1000); // Every 14 minutes
    console.log('[Keep-Alive] Self-ping enabled (every 14 min)');
  }
});
