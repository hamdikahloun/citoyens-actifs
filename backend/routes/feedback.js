const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const User = require("../models/User");
const authenticateToken = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

// Create feedback
router.post("/", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { title, description, lat, lng, postalCode } = req.body;
    if (!lat || !lng || !postalCode) {
      return res.status(400).json({ error: "(lat, lng, postalCode) is required." });
    }

    // Get user by email
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const feedbackData = {
      user: user._id,
      title,
      description,
      location: {
        lat,
        lng,
      },
      postalCode,
    };

    if (req.file) {
      feedbackData.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const feedback = new Feedback(feedbackData);
    await feedback.save();

    // Populate user data before sending response
    await feedback.populate("user", "name");
    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List feedback with optional postal code filter
router.get("/", async (req, res) => {
  try {
    const { postalCode } = req.query;
    const feedbacks = await Feedback.find({ postalCode })
      .sort({ createdAt: -1 })
      .populate("user", "name")
      .populate("comments.user", "name");
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Respond to feedback
router.patch("/:id/respond", async (req, res) => {
  try {
    const { response } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { response },
      { new: true }
    ).populate("user", "name");

    if (!feedback) return res.status(404).json({ error: "Not found" });
    res.json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a comment to feedback
router.post("/:id/comments", authenticateToken, async (req, res) => {

  console.log(`🔥 POST /feedback/${req.params.id}/comments appelée`);
  
  try {
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ error: "Comment is required." });
    }

    // Get user by email
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ error: "Feedback not found" });

    feedback.comments.push({
      user: user._id,
      message: comment,
    });

    await feedback.save();

    // Populate user data before sending response
    await feedback.populate("user", "name");
    await feedback.populate("comments.user", "name");

    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
