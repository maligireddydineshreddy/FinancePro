const Bill = require("../models/BillsModel"); // Import the Expense model
const User = require("../models/UserModel"); // Import the User model

// Add Expense Controller
const addBill = async (req, res) => {
  try {
    const { userId, dueDate, amount, name } = req.body;

    // Create a new expense
    const newBill = new Bill({
      dueDate,
      amount,
      name,
    });

    // Save the expense to the database
    const savedBill = await newBill.save();

    // Find the user and add the expense to their expenses array
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Push the expense into the user's expenses array
    user.bills.push(savedBill._id);
    await user.save();

    // Return the new expense as a response
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Expense Controller
const deleteBill = async (req, res) => {
  try {
    const { userId, billId } = req.body;

    // Find the expense by ID and remove it
    const bill = await Bill.findByIdAndDelete(billId);

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    // Find the user and remove the expense from their expenses array
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the expense from the user's expenses array
    user.bills = user.bills.filter((bill) => bill.toString() !== billId);

    await user.save();

    // Respond with a success message
    res
      .status(200)
      .json({ message: "Bill deleted successfully", succes: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addBill,
  deleteBill,
};
