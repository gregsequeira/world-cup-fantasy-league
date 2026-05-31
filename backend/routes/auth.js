const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'gregsfantasyleaguesecretkey';

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, contact_number } = req.body;
    const role = 'user';

    // Check if user exists
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Insert user with default unverified status
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role, verified, contact_number)
       VALUES ($1, $2, $3, $4, false, $5)
       RETURNING id, name, email, role, verified, contact_number`,
      [name, email, hash, role, contact_number]
    );

    // Issue token
    const token = jwt.sign(
      { userId: result.rows[0].id, role: result.rows[0].role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ user: result.rows[0], token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      'SELECT id, name, email, role, verified, contact_number, password_hash FROM users WHERE email = $1',
      [email]
    );
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Issue token
    const token = jwt.sign(
      { userId: user.rows[0].id, role: user.rows[0].role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        role: user.rows[0].role,
        verified: user.rows[0].verified,
        contact_number: user.rows[0].contact_number,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get pending verification users (admin only)
router.get('/pending-users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, verified, contact_number FROM users WHERE verified = false ORDER BY id DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Verify a user (admin only)
router.post('/verify/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE users SET verified = true WHERE id = $1 RETURNING id, name, email, role, verified, contact_number',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Promote a verified user to admin (admin only)
router.post('/promote/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE users SET role = 'admin', verified = true
       WHERE id = $1 RETURNING id, name, email, role, verified, contact_number`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Reject an unverified user (admin only)
router.delete('/reject/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 AND verified = false RETURNING id, name, email, contact_number',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Unverified user not found' });
    }

    res.json({ message: 'User rejected and removed', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get user info for logged-in user
router.get('/user/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, role, verified, contact_number FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all verified users (admin only)
router.get('/verified-users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, verified, contact_number FROM users WHERE verified = true ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get all users (admin only)
router.get('/all-users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, verified, contact_number FROM users ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Example Express route
router.get('/prize-pool', async (req, res) => {
  try {
    const result = await pool.query(`SELECT COUNT(*) FROM users WHERE verified = true`);
    const count = parseInt(result.rows[0].count, 10);
    const prizePool = count * 200; // R200 per verified user
    res.json({ count, prizePool });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
