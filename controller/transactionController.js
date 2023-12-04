const DepositTransactionModel = require("../models/depositModel");
const WithdrawlTransactionModel = require("../models/withdrawlModel");

exports.addDepositTransaction = async (req, res) => {
  try {
    const { amount, bankAccountNumber } = req.body;
    const transaction = new DepositTransactionModel({
      amount,
      bankAccountNumber,
    });
    await transaction.save();
    return res
      .status(200)
      .json({ success: true, message: "Transaction added successfully.", data: transaction });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDailyDepositTransactions = async (req, res) => {
  try {
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    const dailyTransactions = await DepositTransactionModel.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    res.status(200).json({ success: true, message: "Todays Deposit Transactions.", data: dailyTransactions });
  } catch (error) {
    res.status(500).json({ error: "Error getting daily transactions" });
  }
};

exports.getDailyDepositTransactionsByBankAccountNumber = async (req, res) => {
  try {
    const { bankAccountNumber } = req.body;

    // Calculate the start and end of the current day
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    const dailyTransactions = await DepositTransactionModel.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      bankAccountNumber: bankAccountNumber,
    });

    res.status(200).json({ success: true, message: "Todays Deposit Transactions of one Account Number.", data: dailyTransactions });
  } catch (error) {
    res.status(500).json({ error: "Error getting daily transactions" });
  }
};

exports.getMonthlyDepositTransactions = async (req, res) => {
  try {
    const { month, year } = req.body;

    const startOfMonth = new Date(`${year}-${month}-01`);
    const endOfMonth = new Date(`${year}-${parseInt(month) + 1}-01`);

    const monthlyTransactions = await DepositTransactionModel.find({
      date: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    });

    res.status(200).json({ success: true, message: "Monthly Deposit Transactions", data: monthlyTransactions });
  } catch (error) {
    res.status(500).json({ error: "Error getting monthly transactions" });
  }
};

exports.getMonthlyDepositTransactionsByBankAccountNumber = async (req, res) => {
  try {
    const { month, year ,bankAccountNumber} = req.body;

    const startOfMonth = new Date(`${year}-${month}-01`);
    const endOfMonth = new Date(`${year}-${parseInt(month) + 1}-01`);

    const monthlyTransactions = await DepositTransactionModel.find({
      date: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
      bankAccountNumber
    });

    res.status(200).json({ success: true, message: "Monthly Deposit Transactions", data: monthlyTransactions });
  } catch (error) {
    res.status(500).json({ error: "Error getting monthly transactions" });
  }
};

exports.getYearlyDepositTransactionsByBankAccountNumber = async (req, res) => {
  try {
    const { year, bankAccountNumber } = req.body;

    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${parseInt(year) + 1}-01-01`);

    const yearlyTransactions = await DepositTransactionModel.find({
      date: {
        $gte: startOfYear,
        $lt: endOfYear,
      },
      bankAccountNumber
    });

    res.status(200).json({ success: true, message: "Yearly Deposit Transactions", data: yearlyTransactions });
  } catch (error) {
    res.status(500).json({ error: "Error getting yearly transactions" });
  }
};

exports.getYearlyDepositTransactions = async (req, res) => {
  try {
    const { year } = req.body;

    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${parseInt(year) + 1}-01-01`);

    const yearlyTransactions = await DepositTransactionModel.find({
      date: {
        $gte: startOfYear,
        $lt: endOfYear,
      },
    });

    res.status(200).json({ success: true, message: "Yearly Deposit Transactions", data: yearlyTransactions });
  } catch (error) {
    res.status(500).json({ error: "Error getting yearly transactions" });
  }
};

exports.addWithdrawlTransaction = async (req, res) => {
  try {
    const { amount, bankAccountNumber } = req.body;
    const transaction = new WithdrawlTransactionModel({
      amount,
      bankAccountNumber,
    });
    await transaction.save();
    return res
      .status(200)
      .json({ success: true, message: "Transaction Withdrawl successfully.", data: transaction });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getDailyWithdrawlTransactions = async (req, res) => {
  try {
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    const dailyTransactions = await WithdrawlTransactionModel.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
    res.status(200).json({ success: true, message: "Today's Withdrawl Transaction.", data: dailyTransactions });
  } catch (error) {
    res.status(500).json({ error: "Error getting daily transactions" });
  }
};

exports.getDailyWithdrawlTransactionsByBankAccountNumber = async (req, res) => {
  try {
    const { bankAccountNumber } = req.body;

    // Calculate the start and end of the current day
    const startOfDay = new Date().setHours(0, 0, 0, 0);
    const endOfDay = new Date().setHours(23, 59, 59, 999);

    const dailyTransactions = await WithdrawlTransactionModel.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      bankAccountNumber: bankAccountNumber,
    });

    res.status(200).json({ success: true, message: "Today's Withdrawl Transaction of one Account Number.", data: dailyTransactions });
  } catch (error) {
    res.status(500).json({ error: "Error getting daily transactions" });
  }
};

exports.getMonthlyWithdrawlTransactions = async (req, res) => {
  try {
    const { month, year } = req.body;

    const startOfMonth = new Date(`${year}-${month}-01`);
    const endOfMonth = new Date(`${year}-${parseInt(month) + 1}-01`);

    const monthlyTransactions = await WithdrawlTransactionModel.find({
      date: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    });
    res.status(200).json({ success: true, message: "Today's Withdrawl Transaction.", data: monthlyTransactions });
  } catch (error) {
    res.status(500).json({ error: "Error getting monthly transactions" });
  }
};

exports.getMonthlyWithdrawlTransactionsByBankAccountNumber = async (req, res) => {
  try {
    const { month, year, bankAccountNumber } = req.body;

    const startOfMonth = new Date(`${year}-${month}-01`);
    const endOfMonth = new Date(`${year}-${parseInt(month) + 1}-01`);

    const monthlyTransactions = await WithdrawlTransactionModel.find({
      date: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
      bankAccountNumber
    });
    res.status(200).json({ success: true, message: "Monthly Withdrawl Transaction.", data: monthlyTransactions });
  } catch (error) {
    res.status(500).json({ error: "Error getting monthly transactions" });
  }
};

exports.getYearlyWithdrawlTransactions = async (req, res) => {
  try {
    const { year } = req.body;

    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${parseInt(year) + 1}-01-01`);

    const yearlyTransactions = await DepositTransactionModel.find({
      date: {
        $gte: startOfYear,
        $lt: endOfYear,
      },
    });

    res.status(200).json({ success: true, data: yearlyTransactions });
  } catch (error) {
    res.status(500).json({ error: "Error getting yearly transactions" });
  }
};

exports.getYearlyWithdrawlTransactionsByBankAccountNumber = async (req, res) => {
  try {
    const { year, bankAccountNumber } = req.body;

    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${parseInt(year) + 1}-01-01`);

    const yearlyTransactions = await DepositTransactionModel.find({
      date: {
        $gte: startOfYear,
        $lt: endOfYear,
      },
      bankAccountNumber
    });

    res.status(200).json({ success: true, message: "Yearly Withdrawl Transaction.", data: yearlyTransactions });
  } catch (error) {
    res.status(500).json({ error: "Error getting yearly transactions" });
  }
};