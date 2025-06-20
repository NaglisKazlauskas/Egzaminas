const express = require('express');
const db = require('../config/db');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Create new event
router.post('/create', upload.single('photo'), async (req, res) => {
  const { user_id, title, description, event_date, category_id, location } = req.body;
  let photoUrl = null;
  if (req.file) {
    photoUrl = `/uploads/${req.file.filename}`;
  }
  if (!user_id || !title || !description || !event_date || !category_id || !location) {
    return res.status(400).json({ error: 'All fields except photo are required.' });
  }
  try {
    await db.query(
      'INSERT INTO events (user_id, title, description, event_date, category_id, location, photo, approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, title, description, event_date, category_id, location, photoUrl, false]
    );
    res.status(201).json({ message: 'Event created and pending approval.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const { approved } = req.query;
  let sql = `
    SELECT events.*, users.username
    FROM events
    JOIN users ON events.user_id = users.id
  `;
  let params = [];
  if (approved !== undefined) {
    sql += ' WHERE events.approved = ?';
    params.push(approved);
  }
  const [events] = await db.query(sql, params);
  res.json(events);
});

// Get ratings for an event (count and if current user rated)
router.get('/:id/ratings', async (req, res) => {
  const eventId = req.params.id;
  const userId = req.query.user_id;
  try {
    const [[{ count }]] = await db.query(
      'SELECT COUNT(*) as count FROM event_ratings WHERE event_id = ?', [eventId]
    );
    let userRated = false;
    if (userId) {
      const [rows] = await db.query(
        'SELECT 1 FROM event_ratings WHERE event_id = ? AND user_id = ?', [eventId, userId]
      );
      userRated = rows.length > 0;
    }
    res.json({ count, userRated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Star (rate) an event
router.post('/:id/rate', async (req, res) => {
  const eventId = req.params.id;
  const { user_id } = req.body;
  console.log("Rating event", eventId, "by user", user_id); // <-- Add this
  try {
    await db.query(
      'INSERT IGNORE INTO event_ratings (event_id, user_id) VALUES (?, ?)', [eventId, user_id]
    );
    res.json({ message: 'Event rated.' });
  } catch (err) {
    console.error(err); // <-- Add this
    res.status(500).json({ error: err.message });
  }
});

// Unstar (unrate) an event
router.delete('/:id/rate', async (req, res) => {
  const eventId = req.params.id;
  const { user_id } = req.body;
  try {
    await db.query(
      'DELETE FROM event_ratings WHERE event_id = ? AND user_id = ?', [eventId, user_id]
    );
    res.json({ message: 'Event unrated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;