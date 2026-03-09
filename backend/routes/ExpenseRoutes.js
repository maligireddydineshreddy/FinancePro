const express = require("express");
const router = express.Router();
const ExpenseController = require("../controllers/ExpenseController");

// Add Expense
router.post("/add-expense", ExpenseController.addExpense);

// Remove Expense
router.post("/remove-expense", ExpenseController.deleteExpense);

module.exports = router;
