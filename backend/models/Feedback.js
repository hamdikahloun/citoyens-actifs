const mongoose = require("mongoose");

// modèle signalements pour mongoose avec clé étrangère vers collection User
const FeedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String },
  description: { type: String },
  image: {
    url: String,
    public_id: String,
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  postalCode: { type: String },
  status: {
    type: String,
    enum: ["pending", "done", "in_progress"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
