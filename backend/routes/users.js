var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");
require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');


const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const verificationCodes = new Map();
const existingUser = new Map();
const nouveauUser = new Map();
let existingCount = false;

// Configuration email envoyeur
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate a random 6-digit codee
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
    verificationCodes.set(email, { email, code, timestamp: Date.now() });

    /*verificationCodes.set(email, {
      code,
      timestamp: Date.now(),
    });
    */

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


// route login ***************************************************************************
router.get('/:email', async function (req, res) {
  const testMail = req.params.email;
  if (!EMAIL_REGEX.test(testMail)) {
    res.json({ result: false, error: 'invalid email' });
    return;
  }
  //console.log(testMail);

  //check user connu - si result false => front doit renvoyer vers signup
  const user = await User.findOne({ email : testMail });
  if (!user) {
      res.json({ result: false, error: 'unknown username' });
      return;
    }
    existingUser.set(testMail, {
      data
    });
  existingCount = true;

  const code = generateVerificationCode();
  verificationCodes.set(testMail, {
    code,
    timestamp: Date.now(),
  });

  console.log(verificationCodes.get(testMail).code);

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


// route pour créer un nouveau compte *************************************************************
router.post('/signup', (req, res) => {

  console.log(req.body)
  if (!checkBody(req.body, ['email'])) {

    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  const maimail = req.body.email;
  
  if (!EMAIL_REGEX.test(maimail)) {

    console.log(JSON.stringify(maimail))
    res.json({ result: false, error: 'invalid email' });
    return;
  }

  /*nouveauUser.set(maimail, {
    username: req.body.username,
    name: req.body.name,
    email: maimail,
  })*/
  const code = generateVerificationCode();
      verificationCodes.set(maimail, {
        code,
        timestamp: Date.now(),
      });

      //console.log(verificationCodes.get(testMail));

      // Send email
      try {
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: maimail,
          subject: "Votre code de vérification - Citoyens Actifs",
          text: `Votre code de vérification est : ${code} - il est valable 15 minutes`,
        });
        res.json({ message: "code envoyé à l'utilisateur" })
      } catch (error) {
        console.error("Error sending verification code:", error);
        res.status(500).json({ error: "Failed to send verification code" });
      }
  // Check if the user has not already been registered
});


//route pour vérifier le code envoyé par mail **********************************************************
router.post("/verify-code", async (req, res) => {
  //console.log(verificationCodes.get('tristan.rousseaux@free.fr'));
  console.log('📩 Contenu reçu :', req.body);
  try {
    const { email, code } = req.body;

    
    if (!email || !code) {
      return res.status(400).json({ error: "Email and code are required" });
    }
  
    const storedData = verificationCodes.get(email);
    console.log('code reçu ' + code);
    console.log('code envoyé ' + storedData);

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
      const actualUser = existingUser.get(email).data;
      console.log(actualUser);
      res.json({

        user: actualUser
          ? {
            email: actualUser.email,
            name: actualUser.name,
            username: actualUser.username,
            token: actualUser.token,
          }
          : null,
      });
    } else {
      const actualUser = nouveauUser.get(email);
      console.log(actualUser);
      /*
      const newUser = new User({
        email: actualUser.email,
        name: actualUser.name,
        username: actualUser.username,
        token: uid2(32),
      });*/

    const newUser = new User({
    email,
    name: '',
    username: '',
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