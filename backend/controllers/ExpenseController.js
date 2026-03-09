const Expense = require("../models/ExpenseModel"); // Import the Expense model
const User = require("../models/UserModel"); // Import the User model

// Add Expense Controller
const addExpense = async (req, res) => {
  try {
    const { userId, date, amount, category } = req.body;

    // Create a new expense
    const newExpense = new Expense({
      date,
      amount,
      category,
    });

    // Save the expense to the database
    const savedExpense = await newExpense.save();

    // Find the user and add the expense to their expenses array
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Push the expense into the user's expenses array
    user.expenses.push(savedExpense._id);
    await user.save();

    // Return the new expense as a response
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Expense Controller
const deleteExpense = async (req, res) => {
  try {
    const { userId, expenseId } = req.body;

    // Find the expense by ID and remove it
    const expense = await Expense.findByIdAndDelete(expenseId);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Find the user and remove the expense from their expenses array
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the expense from the user's expenses array
    user.expenses = user.expenses.filter(
      (expense) => expense.toString() !== expenseId
    );

    await user.save();

    // Respond with a success message
    res
      .status(200)
      .json({ message: "Expense deleted successfully", succes: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addExpense,
  deleteExpense,
};
