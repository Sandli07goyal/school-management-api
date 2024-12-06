const express = require('express');
const router = express.Router();
const db = require('../config/db');  // Adjust based on your file structure

// Route to add a school
router.post('/addSchool', (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  db.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'School added successfully' });
  });
});

// Route to list schools (with distance calculation)
router.get('/listSchools', (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const query = 'SELECT * FROM schools';
  db.query(query, (err, schools) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const sortedSchools = schools.map((school) => {
      const distance = calculateDistance(lat, lon, school.latitude, school.longitude);
      return { ...school, distance };
    }).sort((a, b) => a.distance - b.distance);

    res.status(200).json(sortedSchools);
  });
});

module.exports = router;
