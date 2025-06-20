const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  console.log("Register endpoint hit", req.body);
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    // Check if user exists
    const [users] = await db.query('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
    if (users.length > 0) {
      return res.status(409).json({ error: 'User already exists.' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert user
    await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      console.log("No user found for email:", email);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = users[0];
    if (user.banned) return res.status(403).json({ error: 'This user is banned.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials.' });

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: !!user.is_admin
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;