const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, email, is_admin, banned FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ban user
router.post('/users/:id/ban', async (req, res) => {
  try {
    await db.query('UPDATE users SET banned = 1 WHERE id = ?', [req.params.id]);
    res.json({ message: 'User banned.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Make user admin
router.post('/users/:id/makeadmin', async (req, res) => {
  try {
    await db.query('UPDATE users SET is_admin = 1 WHERE id = ?', [req.params.id]);
    res.json({ message: 'User is now admin.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve event
router.post('/events/:id/approve', async (req, res) => {
  try {
    await db.query('UPDATE events SET approved = 1 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Event approved.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete event
router.delete('/events/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM events WHERE id = ?', [req.params.id]);
    res.json({ message: 'Event deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modify event
router.put('/events/:id', async (req, res) => {
  const { title, description, event_date, category_id, photo } = req.body;
  try {
    await db.query(
      'UPDATE events SET title=?, description=?, event_date=?, category_id=?, photo=? WHERE id=?',
      [title, description, event_date, category_id, photo, req.params.id]
    );
    res.json({ message: 'Event updated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create category
router.post('/categories', async (req, res) => {
  const { name } = req.body;
  try {
    await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
    res.json({ message: 'Category created.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unban user
router.post('/users/:id/unban', async (req, res) => {
  try {
    await db.query('UPDATE users SET banned = 0 WHERE id = ?', [req.params.id]);
    res.json({ message: 'User unbanned.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;