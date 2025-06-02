const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    url: String,
    public_id: String,
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  postalCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      message: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
