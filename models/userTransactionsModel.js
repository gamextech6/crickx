const mongoose = require("mongoose");
const userTransactionsSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  amount: {
    type: Number,
    required: true,
  },
  point: {
    type: Number,
  },
  deposit: {
    type: Boolean,
    default: false,
  },
  withdrawl: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  formattedDate: String,
});
const userTransactionsModel = mongoose.model("UserTransactions", userTransactionsSchema);
module.exports = userTransactionsModel;
