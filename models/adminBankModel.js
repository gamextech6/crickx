const mongoose = require('mongoose');

const adminBankModelSchema = new mongoose.Schema({
  bankName : String,
  branchName : String,
  accountHolderName: String, 
  bankAccountNumber: {
    type: String,
    unique: true,
  },
  ifscCode: String,
  qr : String,
  upiID : String,
  active: {
    type: Boolean,
    default: false,
    },
});

const AdminBankModel = mongoose.model('adminBank', adminBankModelSchema);

module.exports = AdminBankModel;