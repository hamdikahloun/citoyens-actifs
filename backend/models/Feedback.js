const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  user: { type: String, required: true }, // user id or email for now
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
  createdAt: { type: Date, default: Date.now },
  comments: [
    {
      user: { type: String, required: true },
      message: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
