const mongoose = require("mongoose");

const billsSchema = new mongoose.Schema(
  {
    dueDate: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Bill = mongoose.model("Bill", billsSchema);

module.exports = Bill;
