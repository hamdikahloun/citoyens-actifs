const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const { postalCode } = req.query;
  if (!postalCode) return res.status(400).json({ error: "postalCode required" });

  try {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&country=France&format=json`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Geocoding failed" });
  }
});

// New endpoint for city polygon
router.get("/city-polygon", async (req, res) => {
  const { postalCode } = req.query;
  if (!postalCode) return res.status(400).json({ error: "postalCode required" });
  try {
    // Search for the place with polygon_geojson=1
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&country=France&format=json&polygon_geojson=1&limit=1`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.length || !data[0].geojson) {
      return res.status(404).json({ error: "Polygon not found" });
    }
    // Only support Polygon or MultiPolygon
    let polygons = [];
    if (data[0].geojson.type === "Polygon") {
      polygons = [data[0].geojson.coordinates];
    } else if (data[0].geojson.type === "MultiPolygon") {
      polygons = data[0].geojson.coordinates;
    }
    // Flatten and map to {lat, lng}
    const coords = polygons.flat(1)[0].map(([lng, lat]) => ({ lat, lng }));
    res.json(coords);
  } catch (err) {
    res.status(500).json({ error: "Polygon fetch failed" });
  }
});

// Geocode full address using Nominatim
router.get("/address", async (req, res) => {
  try {
    const { address } = req.query;
    console.log(address);
    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "CitoyensActifs/1.0",
      },
    });
    const data = await response.json();

    if (data.length === 0) {
      return res.status(404).json({ error: "Address not found" });
    }

    const result = data[0];
    res.json({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      display_name: result.display_name,
      address: result.address,
    });
  } catch (err) {
    console.error("Geocoding error:", err);
    res.status(500).json({ error: "Error geocoding address" });
  }
});

module.exports = router;
