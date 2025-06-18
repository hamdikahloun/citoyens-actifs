var express = require('express');
var router = express.Router();
const nodemailer = require("nodemailer");
require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');

async function searchCity(city, postal) {
  console.log(city, postal)
  //const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=jsonv2&polygon_geojson=1&limit=1`;
  const url = `https://nominatim.openstreetmap.org/search?city=${city}&country=France&format=json&polygon_geojson=1&limit=1`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  return data;
}

// route pour ajouter le nom de ville en BDD **********************************
router.post("/", async (req, res) => {
  const cityName = req.body.cityName;
  const email = req.body.email;
  if (!cityName) return res.status(400).json({ error: "postalCode required" });

  try {
    //console.log(email + ' ' + cityName);
    const data = await searchCity(cityName);
    if (data.length && email.length > 0) {
      console.log('true');
      User.updateOne(
        { email: email },
        { city: cityName }
      ).then(() => {
        console.log('ok');
        res.json(data);
      })
    } else {
      console.log('false');
      res.json('postal code not found');
    };
  } catch (err) {
    res.status(500).json({ error: "Geocoding failed" });
  }
});

// route pour récupérer les limites de la ville à partir de son nom **********************************
router.post('/polygon', async function (req, res) {
  const cityName = req.body.city;

  if (!cityName) {
    res.json({ result: false, error: 'cityname required' });
  }
  try {
    const data = await searchCity(cityName);
    if (!data.length || !data[0].geojson) {
      return res.status(404).json({ error: 'Polygon not found' });
    }
    console.log(data);
    console.log(data[0].geojson.coordinates[0]);
    console.log(data[0].geojson.coordinates[1]);
    let polygons = [];
    if (data[0].geojson.type === 'Polygon') {
      polygons = [data[0].geojson.coordinates];
      console.log('mono ' + polygons.length)
    } else if (data[0].geojson.type === 'MultiPolygon') {
      polygons = data[0].geojson.coordinates;
      console.log('multi ' + polygons.length);
    } else{
      res.json({error: 'Polygon type unknown'});
    }
    const coords = polygons.flat(1)[0].map(([lng, lat])=>([lat, lng]));
    res.json(coords);
  } catch (err) {
    res.status(500).json({ error: "Polygon fetch failed" });
  }
})

// Get city polygon from coordinates
router.get("/coordinates", async (req, res) => {
  try {
    console.log(req.query);
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "CitoyensActifs/1.0",
      },
    });
    const data = await response.json();
    console.log(data.address?.city);

    if (!data.address?.city) {
      return res.status(404).json({ error: "City not found for these coordinates" });
    }
    res.json(data.address.city);
  }catch (err) {
    res.status(500).json({error: 'error to find city from localisation'})
  }
})



module.exports = router;
