const express = require("express");
const router = express.Router();
const BillController = require("../controllers/BillsController");

// Add Expense
router.post("/add-bill", BillController.addBill);

// Remove Expense
router.post("/remove-bill", BillController.deleteBill);

module.exports = router;
