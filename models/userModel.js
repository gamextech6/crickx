const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  otp: String,
  phoneNumber: {
    type: String,
    unique: true,
  },
  firstName: String,
  lastName: String,
  gender: String,
  dob: String,
  role: {
    type: String,
    enum: ["admin", "agent", "user"],
    default: "user",
  },
  balance: {
    type: Number,
    default: 0,
  },
  point: Number,
  ip: String,
  os: String,
  referrerCode: {
    type: String,
    unique: true,
  },
  referral: {
    type: String,
  },
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
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
