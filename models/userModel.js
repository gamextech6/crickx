const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  otp: String,
  phoneNumber: {
    type: String,
    unique: true,
    require:true
  },
  firstName: String,
  lastName: String,
  gender: String,
  dob: String,
  balance: {
    type: Number,
    default: 0,
  },
  point: Number,
  ip: String,
  os: String,
  blocked: {
    type: Boolean,
    default: false,
  }, 
  // agentBlocked: {
  //   type: Boolean,
  //   default: false,
  // },
  bankName : String,
  branchName : String,
  accountHolderName: String, 
  bankAccountNumber: {
    type: String,
    unique: true,
  },
  ifscCode: String,
  aadhar: String,
  pan: String,
  isActive: {
    type: Boolean,
    default: false
  }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
