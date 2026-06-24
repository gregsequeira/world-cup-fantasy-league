const express = require('express');
const router = express.Router();
const pool = require('../db'); // pg Pool

const nextFixtureMap = {
  73: { fixtureId: 89, slot: 'home' },
  75: { fixtureId: 89, slot: 'away' },

  74: { fixtureId: 90, slot: 'home' },
  77: { fixtureId: 90, slot: 'away' },

  76: { fixtureId: 91, slot: 'home' },
  78: { fixtureId: 91, slot: 'away' },

  79: { fixtureId: 92, slot: 'home' },
  80: { fixtureId: 92, slot: 'away' },

  83: { fixtureId: 93, slot: 'home' },
  84: { fixtureId: 93, slot: 'away' },

  81: { fixtureId: 94, slot: 'home' },
  82: { fixtureId: 94, slot: 'away' },

  86: { fixtureId: 95, slot: 'home' },
  88: { fixtureId: 95, slot: 'away' },

  85: { fixtureId: 96, slot: 'home' },
  87: { fixtureId: 96, slot: 'away' },

  89: { fixtureId: 97, slot: 'home' },
  90: { fixtureId: 97, slot: 'away' },

  91: { fixtureId: 99, slot: 'home' },
  92: { fixtureId: 99, slot: 'away' },

  93: { fixtureId: 98, slot: 'home' },
  94: { fixtureId: 98, slot: 'away' },

  95: { fixtureId: 100, slot: 'home' },
  96: { fixtureId: 100, slot: 'away' },

  97: { fixtureId: 101, slot: 'home' },
  98: { fixtureId: 101, slot: 'away' },

  99: { fixtureId: 102, slot: 'home' },
  100: { fixtureId: 102, slot: 'away' },

  101: { fixtureId: 104, slot: 'home' },
  102: { fixtureId: 104, slot: 'away' },
};

// Get all fixtures
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT f.*,
             t1.name AS home_team,
             t2.name AS away_team,
             t1.flag_code AS home_flag,
             t2.flag_code AS away_flag,
             f.home_placeholder,
             f.away_placeholder,
             f.penalty_home,
             f.penalty_away,
             f.decided_by
      FROM fixtures f
      LEFT JOIN teams t1 ON f.home_team_id = t1.id
      LEFT JOIN teams t2 ON f.away_team_id = t2.id
      ORDER BY f.match_date, f.match_time
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get fixtures for a specific team
router.get('/team/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT f.*,
             t1.name AS home_team,
             t2.name AS away_team,
             t1.flag_code AS home_flag,
             t2.flag_code AS away_flag,
             f.home_placeholder,
             f.away_placeholder,
             f.penalty_home,
             f.penalty_away,
             f.decided_by
      FROM fixtures f
      LEFT JOIN teams t1 ON f.home_team_id = t1.id
      LEFT JOIN teams t2 ON f.away_team_id = t2.id
      WHERE f.home_team_id = $1 OR f.away_team_id = $1
      ORDER BY f.match_date, f.match_time
    `, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add a new fixture (supports placeholders)
router.post('/', async (req, res) => {
  try {
    const {
      home_team_id,
      away_team_id,
      home_placeholder,
      away_placeholder,
      match_date,
      match_time,
      venue,
      stage,
      round
    } = req.body;

    const result = await pool.query(
      `INSERT INTO fixtures (home_team_id, away_team_id, home_placeholder, away_placeholder,
                             match_date, match_time, venue, stage, round)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [home_team_id, away_team_id, home_placeholder, away_placeholder,
       match_date, match_time, venue, stage, round]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update fixture result (handles penalties + winner assignment)
router.put('/:id/result', async (req, res) => {
  try {
    const fixtureId = parseInt(req.params.id, 10);
    const { home_score, away_score, penalty_home, penalty_away, status } = req.body;

    // Fetch current fixture to get team IDs
    const fixture = await pool.query(
      'SELECT home_team_id, away_team_id FROM fixtures WHERE id=$1',
      [fixtureId]
    );
    if (fixture.rows.length === 0) {
      return res.status(404).send('Fixture not found');
    }
    const { home_team_id, away_team_id } = fixture.rows[0];

    let winner_team_id = null;
    let decided_by = 'normal';

    if (home_score > away_score) {
      winner_team_id = home_team_id;
    } else if (away_score > home_score) {
      winner_team_id = away_team_id;
    } else {
      // Draw → penalties decide
      decided_by = 'penalties';
      if (penalty_home > penalty_away) {
        winner_team_id = home_team_id;
      } else {
        winner_team_id = away_team_id;
      }
    }

    const result = await pool.query(
      `UPDATE fixtures
       SET home_score=$1, away_score=$2,
           penalty_home=$3, penalty_away=$4,
           status=$5, winner_team_id=$6, decided_by=$7
       WHERE id=$8 RETURNING *`,
      [home_score, away_score, penalty_home, penalty_away,
       status, winner_team_id, decided_by, fixtureId]
    );

    const nextMatch = nextFixtureMap[fixtureId];

if (
  status === 'Completed' &&
  nextMatch &&
  winner_team_id
) {
  const field =
    nextMatch.slot === 'home'
      ? 'home_team_id'
      : 'away_team_id';
  await pool.query(
  `UPDATE fixtures
   SET ${field} = $1,
       ${field === 'home_team_id'
          ? 'home_placeholder'
          : 'away_placeholder'} = NULL
   WHERE id = $2`,
  [winner_team_id, nextMatch.fixtureId]
);
}

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
