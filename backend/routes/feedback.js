const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const authenticateToken = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

// Create feedback
router.post("/", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { title, description, lat, lng } = req.body;
    if (!lat || !lng) {
      return res.status(400).json({ error: "(lat, lng) is required." });
    }

    const feedbackData = {
      user: req.user.email,
      title,
      description,
      location: {
        lat,
        lng,
      },
    };

    if (req.file) {
      feedbackData.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const feedback = new Feedback(feedbackData);
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List all feedback
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Respond to feedback
router.patch("/:id/respond", async (req, res) => {
  try {
    const { response } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { response }, { new: true });
    if (!feedback) return res.status(404).json({ error: "Not found" });
    res.json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a comment to feedback
router.post("/:id/comments", authenticateToken, async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ error: "Comment is required." });
    }
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ error: "Feedback not found" });
    feedback.comments.push({ user: req.user.email, message: comment });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
