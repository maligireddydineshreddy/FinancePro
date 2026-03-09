const User = require("../models/UserModel");
const Savings = require("../models/SavingsModel");

const SavingsController = {
  // Add a saving
  addSaving: async (req, res) => {
    try {
      const { userId, amount, goal, date } = req.body;

      // Validate required fields
      if (!userId || !amount) {
        return res
          .status(400)
          .json({ message: "User ID and amount are required." });
      }

      // Create a new saving
      const saving = new Savings({
        amount,
        goal,
        date: date || Date.now(),
      });

      // Save the saving
      const savedSaving = await saving.save();

      // Find the user and update their savings list
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      user.savings.push(savedSaving._id);
      await user.save();

      res
        .status(201)
        .json({ message: "Saving added successfully.", saving: savedSaving });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error adding saving.", error: error.message });
    }
  },

  // Remove a saving
  removeSaving: async (req, res) => {
    try {
      const { userId, savingId } = req.body;

      // Validate required fields
      if (!userId || !savingId) {
        return res
          .status(400)
          .json({ message: "User ID and saving ID are required." });
      }

      // Find and delete the saving
      const saving = await Savings.findByIdAndDelete(savingId);
      if (!saving) {
        return res.status(404).json({ message: "Saving not found." });
      }

      // Remove the reference from the user model
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      user.savings = user.savings.filter((id) => id.toString() !== savingId);
      await user.save();

      res.status(200).json({ message: "Saving removed successfully.", saving });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error removing saving.", error: error.message });
    }
  },
};

module.exports = SavingsController;
