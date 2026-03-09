const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connectionString = process.env.MONGODB_URI || "mongodb+srv://someshrocks144:somesh2004@cluster0.gs6wg.mongodb.net/financeApp?retryWrites=true&w=majority&appName=Cluster0";

    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 10000, // 10 seconds — fail fast on cold start
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000, // 10 seconds
      maxPoolSize: 10,         // Reuse up to 10 connections
      minPoolSize: 2,          // Keep at least 2 connections warm
      maxIdleTimeMS: 60000,    // Close idle connections after 60s
    });
    console.log("✅ Database Connected Successfully!!");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    console.error("⚠️  Please check:");
    console.error("   1. MongoDB Atlas IP whitelist includes your IP (0.0.0.0/0 for all)");
    console.error("   2. MongoDB Atlas cluster is running");
    console.error("   3. Network connection is stable");
    // Don't exit - allow server to start but operations will fail gracefully
  }
};

// Handle connection events
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected");
});

module.exports = connectDB;
