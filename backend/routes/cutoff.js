const express = require('express');
const router = express.Router();
const pool = require('../db');

// Configurable knockout cutoff (South Africa time, UTC+2)
const knockoutCutoffLocal = new Date('2026-06-28T19:00:00+02:00');

// Convert to UTC once, so frontend countdown is consistent
const knockoutCutoffUTC = new Date(
  knockoutCutoffLocal.getTime() - knockoutCutoffLocal.getTimezoneOffset() * 60000
);

router.get('/', async (req, res) => {
  try {
    // Step 1: Get first fixture (group stage start)
    const result = await pool.query(
      `SELECT match_date, match_time 
       FROM fixtures 
       ORDER BY match_date ASC, match_time ASC 
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No fixtures found' });
    }

    const { match_date, match_time } = result.rows[0];

    // Format date/time safely
    const matchDate = typeof match_date === 'string'
      ? match_date
      : match_date.toISOString().split('T')[0];

    const matchTime = typeof match_time === 'string'
      ? match_time
      : match_time.toISOString().split('T')[1].slice(0, 8);

    const matchDateTime = new Date(`${matchDate}T${matchTime}`);
    if (isNaN(matchDateTime)) {
      return res.status(500).json({ error: 'Invalid date/time format in fixtures' });
    }

    // Group stage cutoff = 2 hours before first fixture
    const groupCutoff = new Date(matchDateTime.getTime() - 2 * 60 * 60 * 1000);

    // Step 2: Decide which cutoff applies
    const now = new Date();
    let cutoff;

    if (now < knockoutCutoffUTC) {
      // Before knockout cutoff → use knockout deadline
      cutoff = knockoutCutoffUTC;
    } else {
      // Otherwise → fallback to group cutoff (historical)
      cutoff = groupCutoff;
    }

    // Always return UTC ISO string
    res.json({ cutoff: cutoff.toISOString() });
  } catch (err) {
    console.error('Cutoff route error:', err);
    res.status(500).json({ error: 'Failed to calculate cutoff' });
  }
});

module.exports = router;
