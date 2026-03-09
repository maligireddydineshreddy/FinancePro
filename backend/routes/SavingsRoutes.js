const express = require("express");
const router = express.Router();
const SavingsController = require("../controllers/SavingController");

// Add a saving
router.post("/add-saving", SavingsController.addSaving);

// Remove a saving
router.post("/remove-saving", SavingsController.removeSaving);

module.exports = router;
