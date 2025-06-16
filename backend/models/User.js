const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String },
  name: { type: String },
  postalCode: { type: String },
  cityCoords: {
    lat: { type: Number },
    lng: { type: Number },
  },
  role: {
    type: String,
    enum: ["admin", "user", "public_service"],
    default: "user",
  },
  address: { type: String },
  phone: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
