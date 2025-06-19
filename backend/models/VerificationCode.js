const mongoose = require("mongoose");

const VerificationCodeSchema = new mongoose.Schema({
  email: { type: String },
  code: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 300 },
});

module.exports = mongoose.model("VerificationCode", VerificationCodeSchema);
