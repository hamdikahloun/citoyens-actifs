var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");
require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const verificationCodes = new Map();
let existingCount = false;

// Configuration email envoyeur
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


// route login
router.get('/:email', function (req, res) {
  const testMail = req.params.email;
  if (!EMAIL_REGEX.test(testMail)) {
    res.json({ result: false, error: 'invalid email' });
    return;
  }
  console.log(testMail);

  //check user connu - si result false => front doit renvoyer vers signup
  User.findOne({ email: testMail }).then(data => {
    if (!data) {
      res.json({ result: false, error: 'unknown username' });
    }
  });

  existingCount = true;

  const code = generateVerificationCode();
  verificationCodes.set(testMail, {
    code,
    timestamp: Date.now(),
  });

  // Send email
  try {
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: testMail,
      subject: "Votre code de vérification - Citoyens Actifs",
      text: `Votre code de vérification est : ${code}`,
    });
    res.json({ message: "code envoyé à l'utilisateur" })
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).json({ error: "Failed to send verification code" });
  }
});


// route pour créer un nouveau compte
router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['username', 'name', 'email'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  if (!EMAIL_REGEX.test(req.body.email)) {
    res.json({ result: false, error: 'invalid email' });
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ email: req.body.email }).then(data => {
    if (data === null) {

      const code = generateVerificationCode();
      verificationCodes.set(testMail, {
        code,
        timestamp: Date.now(),
      });

      // Send email
      try {
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: testMail,
          subject: "Votre code de vérification - Citoyens Actifs",
          text: `Votre code de vérification est : ${code}`,
        });
        res.json({ message: "code envoyé à l'utilisateur" })
      } catch (error) {
        console.error("Error sending verification code:", error);
        res.status(500).json({ error: "Failed to send verification code" });
      }

    } else {
      // User already exists in database
      res.json({ result: false, error: 'User already exists' });
    }
  });
});


//route pour vérifier le code envoyé par mail
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

    // Clear the verification code
    verificationCodes.delete(email);

    // connexion si compte existant ou création de compte si nouveau compte
    if (existingCount) {
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
    } else {

      const newUser = new User({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        token: uid2(32),
      });

      newUser.save().then(newDoc => {
        res.json({ result: true, token: newDoc.token });
      });
    }
    
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ error: "Failed to verify code" });
  }
});

module.exports = router;
