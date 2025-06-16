const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const User = require("../models/User");
const authenticateToken = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

router.post("/", authenticateToken, upload.single("image"), async (req, res) => {
  try {
    const { title, description, lat, lng, postalCode } = req.body;
    if (!lat || !lng || !postalCode) {
      return res.status(400).json({ error: "(lat, lng, postalCode) is required." });
    }

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

    await feedback.populate("user", "name");
    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { postalCode } = req.query;
    if (!postalCode) {
      return res.status(400).json({ error: "Postal code is required" });
    }

    const feedbacks = await Feedback.find({
      postalCode,
      status: { $ne: "done" },
    })
      .sort({ createdAt: -1 })
      .populate("user", "name")
      .populate("comments.user", "name");
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/comments", authenticateToken, async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) {
      return res.status(400).json({ error: "Comment is required." });
    }

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

    await feedback.populate("user", "name");
    await feedback.populate("comments.user", "name");

    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !["pending", "done", "in_progress"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Valid status (pending, done, in_progress) is required." });
    }

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const canUpdate =
      user.role === "admin" ||
      user.role === "public_service" ||
      feedback.user.toString() === user._id.toString();

    if (!canUpdate) {
      return res.status(403).json({
        error: "Only admins, public services, or the feedback owner can update feedback status",
      });
    }

    feedback.status = status;
    await feedback.save();

    await feedback.populate("user", "name");
    await feedback.populate("comments.user", "name");

    res.json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
