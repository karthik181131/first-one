const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  const sql = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
  pool.query(sql, [name, email, message], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database error.' });
    }
    res.json({ success: true, message: 'Message stored successfully!' });
  });
});

app.get('/', (req, res) => {
  res.send('Contact form backend is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 