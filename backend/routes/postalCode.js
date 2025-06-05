var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");
require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');

// route pour ajouter le code postal en BDD **********************************
router.post("/", async (req, res) => {
  const cityName = req.body.cityName;
  const email = req.body.email;
  if (!cityName) return res.status(400).json({ error: "postalCode required" });

  try {
    //console.log(email + ' ' + cityName);
    const url = `https://nominatim.openstreetmap.org/search?city=${cityName}&country=France&format=json&polygon_geojson=1&limit=1`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (data.length && email.length > 0) {
      console.log('true');
      User.updateOne(
        { email: email },
        { city: cityName }
      ).then(() => { console.log('ok') });
      res.json(data);
    } else {
      console.log('false');
      res.json('postal code not found');
    };
  } catch (err) {
    res.status(500).json({ error: "Geocoding failed" });
  }
});

// route pour récupérer les coordonnées à partir du code postal **********************************

module.exports = router;