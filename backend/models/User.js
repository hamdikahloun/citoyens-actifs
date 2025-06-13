const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  postalCode: { type: String, required: true },
  cityCoords: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  role: {
    type: String,
    enum: ["admin", "user", "public_service"],
    default: "user",
    required: true,
  },
  address: { type: String },
  phone: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
