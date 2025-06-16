const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const VerificationCode = require("../models/VerificationCode");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post("/send-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const code = generateVerificationCode();

    await VerificationCode.findOneAndUpdate({ email }, { code }, { upsert: true, new: true });

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

router.post("/verify-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: "Email and code are required" });
    }

    const verificationCode = await VerificationCode.findOne({ email, code });

    if (!verificationCode) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    const user = await User.findOne({ email });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" });

    await VerificationCode.deleteOne({ email, code });

    res.json({
      token,
      user: user
        ? {
            email: user.email,
            name: user.name,
            postalCode: user.postalCode,
            cityCoords: user.cityCoords,
            role: user.role,
            _id: user._id,
            address: user.address,
            phone: user.phone,
          }
        : null,
    });
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ error: "Failed to verify code" });
  }
});

module.exports = router;
