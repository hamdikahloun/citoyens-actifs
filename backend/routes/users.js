const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authenticateToken = require("../middleware/auth");

/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log("🔥 POST /users appelée");
  res.send("respond with a resource");
});

// Get current user profile
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to get user profile" });
  }
});

//router.post("/", authenticateToken, async (req, res) => {
router.post("/", async (req, res) => {
  console.log(">>> Reçu requête POST /users")
  //const { name, postalCode } = req.body;
  //const email = req.user.email;
  const { email, name, postalCode } = req.body;
  
  if (!email || !name || !postalCode) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    // Geocode postal code to get cityCoords
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&country=France&format=json`
    );
    const geoData = await geoRes.json();
    if (!geoData.length) {
      return res.status(400).json({ error: "Postal code not found" });
    }
    const cityCoords = {
      lat: parseFloat(geoData[0].lat),
      lng: parseFloat(geoData[0].lon),
    };

    const user = await User.findOneAndUpdate(
      { email },
      { name, postalCode, cityCoords },
      { new: true, upsert: true }
    );
    res.json(user);
  } catch (err) {
    console.error("Erreur backend :", err);
    res.status(500).json({ error: "Failed to save user" });
  }
});

module.exports = router;
