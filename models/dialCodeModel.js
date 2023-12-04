const mongoose = require('mongoose');

const dialCodeSchema = new mongoose.Schema(
  {
    name: String,
    flag: String,
    code: String,
    dial_code: String
  }
);

const DialCodeModel = mongoose.model('dialCode', dialCodeSchema);

module.exports = DialCodeModel;
