const mongoose = require("mongoose");

const savingsSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true }, // Savings amount
    goal: { type: String }, // Optional goal for the savings
    date: { type: Date, default: Date.now }, // Date of saving
  },
  { timestamps: true }
);

const Savings = mongoose.model("Savings", savingsSchema);

module.exports = Savings;
