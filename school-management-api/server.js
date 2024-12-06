const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 3000;  // use environment variable for port

app.use(express.json()); // To parse JSON bodies

// Use environment variables for database connection
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,  // Use MYSQL_HOST from environment variable
  user: process.env.MYSQL_USER,  // Use MYSQL_USER from environment variable
  password: process.env.MYSQL_PASSWORD,  // Use MYSQL_PASSWORD from environment variable
  database: process.env.MYSQL_DATABASE  // Use MYSQL_DATABASE from environment variable
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to the database!');
});

// Add School API
app.post('/api/addSchool', (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Insert the new school into the database
  const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  db.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      console.log('Error inserting school:', err);
      return res.status(500).send('Error adding school');
    }
    res.status(201).send('School added');
  });
});

// List Schools API
app.get('/api/listSchools', (req, res) => {
  const { lat, lon } = req.query;

  // Query to list schools near the specified latitude and longitude (optional, can be extended)
  const query = 'SELECT * FROM schools WHERE latitude = ? AND longitude = ?';
  db.query(query, [lat, lon], (err, result) => {
    if (err) {
      console.log('Error fetching schools:', err);
      return res.status(500).send('Error fetching schools');
    }
    res.status(200).json(result);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
