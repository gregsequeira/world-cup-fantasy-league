const express = require('express');
const router = express.Router();
const pool = require('../db');

const displayPhaseSql = `
  CASE
    WHEN EXISTS (
      SELECT 1
      FROM fixtures
      WHERE round::integer >= 4
        AND (
          status = 'Completed'
          OR ((match_date::date + match_time::time) <= NOW())
        )
    )
    THEN 'knockout'
    ELSE 'group'
  END
`;

const selectionsCte = `
  selections AS (
    SELECT user_id, 'group' AS phase, 'Favourite' AS role, favourite_team_id AS team_id
    FROM user_selections
    WHERE favourite_team_id IS NOT NULL

    UNION ALL SELECT user_id, 'group', 'Seeded', seeded_team_id
    FROM user_selections
    WHERE seeded_team_id IS NOT NULL

    UNION ALL SELECT user_id, 'group', 'DarkHorse', dark_horse_team_id
    FROM user_selections
    WHERE dark_horse_team_id IS NOT NULL

    UNION ALL SELECT user_id, 'group', 'Underdog', underdog_team_id
    FROM user_selections
    WHERE underdog_team_id IS NOT NULL

    UNION ALL SELECT user_id, 'knockout', 'KOFavourite', ko_favourite_team_id
    FROM user_knockout_selections
    WHERE ko_favourite_team_id IS NOT NULL

    UNION ALL SELECT user_id, 'knockout', 'KO1', ko_team1_id
    FROM user_knockout_selections
    WHERE ko_team1_id IS NOT NULL

    UNION ALL SELECT user_id, 'knockout', 'KO2', ko_team2_id
    FROM user_knockout_selections
    WHERE ko_team2_id IS NOT NULL

    UNION ALL SELECT user_id, 'knockout', 'KO3', ko_team3_id
    FROM user_knockout_selections
    WHERE ko_team3_id IS NOT NULL
  )
`;

const teamPointsCte = `
  team_points AS (
    SELECT
      sel.user_id,
      sel.phase,
      sel.role,
      sel.team_id,
      SUM(
        CASE
          WHEN sel.phase = 'group'
            AND f.status = 'Completed'
            AND f.round::integer <= 3
            AND sel.role IN ('Favourite', 'Underdog')
          THEN
            CASE
              WHEN sel.team_id = f.home_team_id AND f.home_score > f.away_score THEN 6
              WHEN sel.team_id = f.away_team_id AND f.away_score > f.home_score THEN 6
              WHEN (sel.team_id = f.home_team_id OR sel.team_id = f.away_team_id)
                AND f.home_score = f.away_score THEN 2
              ELSE 0
            END

          WHEN sel.phase = 'group'
            AND f.status = 'Completed'
            AND f.round::integer <= 3
          THEN
            CASE
              WHEN sel.team_id = f.home_team_id AND f.home_score > f.away_score THEN 3
              WHEN sel.team_id = f.away_team_id AND f.away_score > f.home_score THEN 3
              WHEN (sel.team_id = f.home_team_id OR sel.team_id = f.away_team_id)
                AND f.home_score = f.away_score THEN 1
              ELSE 0
            END

          WHEN sel.phase = 'knockout'
            AND f.status = 'Completed'
            AND f.round::integer >= 4
            AND sel.role = 'KOFavourite'
          THEN
            CASE
              WHEN sel.team_id = f.winner_team_id THEN 6
              ELSE 0
            END

          WHEN sel.phase = 'knockout'
            AND f.status = 'Completed'
            AND f.round::integer >= 4
          THEN
            CASE
              WHEN sel.team_id = f.winner_team_id THEN 3
              ELSE 0
            END

          ELSE 0
        END
      ) AS points,
      SUM(
        CASE
          WHEN sel.phase = 'group'
            AND f.status = 'Completed'
            AND f.round::integer <= 3
            AND sel.team_id = f.home_team_id
          THEN f.home_score - f.away_score

          WHEN sel.phase = 'group'
            AND f.status = 'Completed'
            AND f.round::integer <= 3
            AND sel.team_id = f.away_team_id
          THEN f.away_score - f.home_score

          WHEN sel.phase = 'knockout'
            AND f.status = 'Completed'
            AND f.round::integer >= 4
            AND sel.team_id = f.home_team_id
          THEN f.home_score - f.away_score

          WHEN sel.phase = 'knockout'
            AND f.status = 'Completed'
            AND f.round::integer >= 4
            AND sel.team_id = f.away_team_id
          THEN f.away_score - f.home_score

          ELSE 0
        END
      ) AS goal_difference
    FROM selections sel
    LEFT JOIN fixtures f
      ON sel.team_id = f.home_team_id
      OR sel.team_id = f.away_team_id
    GROUP BY sel.user_id, sel.phase, sel.role, sel.team_id
  )
`;

// Get all users' scores
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      WITH
      ${selectionsCte},
      ${teamPointsCte}
      SELECT
        u.id AS user_id,
        u.name AS user_name,
        u.verified,
        ${displayPhaseSql} AS display_phase,
        COALESCE(SUM(CASE WHEN tp.phase = 'group' THEN tp.points ELSE 0 END), 0) AS group_points,
        COALESCE(SUM(CASE WHEN tp.phase = 'knockout' THEN tp.points ELSE 0 END), 0) AS knockout_points,
        COALESCE(SUM(tp.points), 0) AS total_points,
        COALESCE(SUM(CASE WHEN tp.phase = 'group' THEN tp.goal_difference ELSE 0 END), 0) AS group_goal_difference,
        COALESCE(SUM(CASE WHEN tp.phase = 'knockout' THEN tp.goal_difference ELSE 0 END), 0) AS knockout_goal_difference,
        COALESCE(SUM(tp.goal_difference), 0) AS total_goal_difference
      FROM users u
      LEFT JOIN team_points tp ON u.id = tp.user_id
      GROUP BY u.id, u.name, u.verified
      ORDER BY total_points DESC, total_goal_difference DESC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get detailed scores per team for each user
router.get('/details', async (req, res) => {
  try {
    const result = await pool.query(`
      WITH
      ${selectionsCte},
      ${teamPointsCte}
      SELECT
        u.id AS user_id,
        u.name AS user_name,
        u.verified,
        ${displayPhaseSql} AS display_phase,
        COALESCE(SUM(CASE WHEN tp.phase = 'group' THEN tp.points ELSE 0 END), 0) AS group_points,
        COALESCE(SUM(CASE WHEN tp.phase = 'knockout' THEN tp.points ELSE 0 END), 0) AS knockout_points,
        COALESCE(SUM(tp.points), 0) AS total_points,
        COALESCE(SUM(CASE WHEN tp.phase = 'group' THEN tp.goal_difference ELSE 0 END), 0) AS group_goal_difference,
        COALESCE(SUM(CASE WHEN tp.phase = 'knockout' THEN tp.goal_difference ELSE 0 END), 0) AS knockout_goal_difference,
        COALESCE(SUM(tp.goal_difference), 0) AS total_goal_difference,
        COALESCE(
          json_agg(
            json_build_object(
              'phase', tp.phase,
              'role', tp.role,
              'team_id', t.id,
              'team_name', t.name,
              'flag_code', t.flag_code,
              'points', COALESCE(tp.points, 0),
              'goal_difference', COALESCE(tp.goal_difference, 0)
            )
            ORDER BY tp.role
          ) FILTER (WHERE t.id IS NOT NULL AND tp.phase = 'group'),
          '[]'
        ) AS group_selections,
        COALESCE(
          json_agg(
            json_build_object(
              'phase', tp.phase,
              'role', tp.role,
              'team_id', t.id,
              'team_name', t.name,
              'flag_code', t.flag_code,
              'points', COALESCE(tp.points, 0),
              'goal_difference', COALESCE(tp.goal_difference, 0)
            )
            ORDER BY tp.role
          ) FILTER (WHERE t.id IS NOT NULL AND tp.phase = 'knockout'),
          '[]'
        ) AS knockout_selections,
        COALESCE(
          json_agg(
            json_build_object(
              'phase', tp.phase,
              'role', tp.role,
              'team_id', t.id,
              'team_name', t.name,
              'flag_code', t.flag_code,
              'points', COALESCE(tp.points, 0),
              'goal_difference', COALESCE(tp.goal_difference, 0)
            )
            ORDER BY tp.phase, tp.role
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) AS selections
      FROM users u
      LEFT JOIN team_points tp ON u.id = tp.user_id
      LEFT JOIN teams t ON tp.team_id = t.id
      GROUP BY u.id, u.name, u.verified
      ORDER BY total_points DESC, total_goal_difference DESC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get score for a single user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await pool.query(`
      WITH
      ${selectionsCte},
      ${teamPointsCte}
      SELECT
        u.id AS user_id,
        u.name AS user_name,
        ${displayPhaseSql} AS display_phase,
        COALESCE(SUM(CASE WHEN tp.phase = 'group' THEN tp.points ELSE 0 END), 0) AS group_points,
        COALESCE(SUM(CASE WHEN tp.phase = 'knockout' THEN tp.points ELSE 0 END), 0) AS knockout_points,
        COALESCE(SUM(tp.points), 0) AS total_points,
        COALESCE(SUM(CASE WHEN tp.phase = 'group' THEN tp.goal_difference ELSE 0 END), 0) AS group_goal_difference,
        COALESCE(SUM(CASE WHEN tp.phase = 'knockout' THEN tp.goal_difference ELSE 0 END), 0) AS knockout_goal_difference,
        COALESCE(SUM(tp.goal_difference), 0) AS total_goal_difference
      FROM users u
      LEFT JOIN team_points tp ON u.id = tp.user_id
      WHERE u.id = $1
      GROUP BY u.id, u.name;
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found or no teams selected' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;