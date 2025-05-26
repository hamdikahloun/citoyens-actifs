const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Store verification codes temporarily (use MongoDB)
const verificationCodes = new Map();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate a random 6-digit code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification code
router.post("/send-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const code = generateVerificationCode();
    verificationCodes.set(email, {
      code,
      timestamp: Date.now(),
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Votre code de vérification - Citoyens Actifs",
      text: `Votre code de vérification est : ${code}`,
    });

    res.json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).json({ error: "Failed to send verification code" });
  }
});

// Verify code and return JWT
router.post("/verify-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: "Email and code are required" });
    }

    const storedData = verificationCodes.get(email);

    if (!storedData || storedData.code !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // Check if code is expired (15 minutes)
    if (Date.now() - storedData.timestamp > 15 * 60 * 1000) {
      verificationCodes.delete(email);
      return res.status(400).json({ error: "Verification code expired" });
    }

    // Check if user exists in the database
    const user = await User.findOne({ email });

    // Generate JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" });

    // Clear the verification code
    verificationCodes.delete(email);

    res.json({
      token,
      user: user
        ? {
            email: user.email,
            name: user.name,
            postalCode: user.postalCode,
            cityCoords: user.cityCoords,
          }
        : null,
    });
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ error: "Failed to verify code" });
  }
});

module.exports = router;
