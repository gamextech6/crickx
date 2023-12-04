const express = require('express');
const { 
    addDepositTransaction, 
    getDailyDepositTransactions, 
    getMonthlyDepositTransactions, 
    getYearlyDepositTransactions,
    getDailyDepositTransactionsByBankAccountNumber,
    addWithdrawlTransaction, 
    getDailyWithdrawlTransactions, 
    getMonthlyWithdrawlTransactions, 
    getYearlyWithdrawlTransactions,
    getDailyWithdrawlTransactionsByBankAccountNumber,
    getMonthlyDepositTransactionsByBankAccountNumber,
    getYearlyDepositTransactionsByBankAccountNumber,
    getMonthlyWithdrawlTransactionsByBankAccountNumber,
    getYearlyWithdrawlTransactionsByBankAccountNumber
 } = require('../controller/transactionController');

const router = express.Router();

// Use more specific paths to avoid conflicts
router.post('/postdailydeposit', addDepositTransaction);
router.post('/getdailydeposit', getDailyDepositTransactions);
router.post('/getdailydepositbybankaccount', getDailyDepositTransactionsByBankAccountNumber);
router.post('/getmonthlydeposit', getMonthlyDepositTransactions);
router.post('/getmonthlydepositbybankaccount', getMonthlyDepositTransactionsByBankAccountNumber);
router.post('/getyearlydeposit', getYearlyDepositTransactions);
router.post('/getyearlydepositbybankaccount', getYearlyDepositTransactionsByBankAccountNumber);
router.post('/postdailywithdrawl', addWithdrawlTransaction);
router.post('/getdailywithdrawl', getDailyWithdrawlTransactions);
router.post('/getdailywithdrawlbybankaccount', getDailyWithdrawlTransactionsByBankAccountNumber);
router.post('/getmonthlywithdrawl', getMonthlyWithdrawlTransactions);
router.post('/getmonthlywithdrawlbybankaccount',  getMonthlyWithdrawlTransactionsByBankAccountNumber);
router.post('/getyearlywithdrawl', getYearlyWithdrawlTransactions);
router.post('/getyearlywithdrawlbybankaccount', getYearlyWithdrawlTransactionsByBankAccountNumber);

module.exports = router;
