const express = require('express');
const router = express.Router();
const pool = require('../db');

/*
 * GET ALL TEAMS
 * Optional:
 *   ?maxRound=3
 */
router.get('/', async (req, res) => {
  try {
    const maxRound = req.query.maxRound
      ? parseInt(req.query.maxRound, 10)
      : null;

    const result = await pool.query(
      `
      SELECT
        t.id AS team_id,
        t.name AS team_name,
        t.group_name,
        t.ranking,
        t.flag_code,

        COUNT(f.id) AS played,

        COUNT(f.id) FILTER (
          WHERE f.home_team_id = t.id
            AND f.home_score > f.away_score
        )
        +
        COUNT(f.id) FILTER (
          WHERE f.away_team_id = t.id
            AND f.away_score > f.home_score
        ) AS won,

        COUNT(f.id) FILTER (
          WHERE f.home_score = f.away_score
        ) AS drawn,

        COUNT(f.id) FILTER (
          WHERE f.home_team_id = t.id
            AND f.home_score < f.away_score
        )
        +
        COUNT(f.id) FILTER (
          WHERE f.away_team_id = t.id
            AND f.away_score < f.home_score
        ) AS lost,

        COALESCE(
          SUM(
            CASE
              WHEN f.home_team_id = t.id THEN f.home_score
              ELSE f.away_score
            END
          ),
          0
        ) AS goals_for,

        COALESCE(
          SUM(
            CASE
              WHEN f.home_team_id = t.id THEN f.away_score
              ELSE f.home_score
            END
          ),
          0
        ) AS goals_against,

        COALESCE(
          SUM(
            CASE
              WHEN f.home_team_id = t.id
                THEN f.home_score - f.away_score
              ELSE
                f.away_score - f.home_score
            END
          ),
          0
        ) AS goal_difference,

        COALESCE(
          SUM(
            CASE
              WHEN f.home_team_id = t.id
                   AND f.home_score > f.away_score THEN 3
              WHEN f.away_team_id = t.id
                   AND f.away_score > f.home_score THEN 3
              WHEN f.home_score = f.away_score THEN 1
              ELSE 0
            END
          ),
          0
        ) AS points

      FROM teams t

      LEFT JOIN fixtures f
        ON (
             t.id = f.home_team_id
             OR t.id = f.away_team_id
           )
       AND f.status = 'Completed'
       AND (
             $1::int IS NULL
             OR f.round::int <= $1
           )

      GROUP BY
        t.id,
        t.name,
        t.group_name,
        t.ranking,
        t.flag_code

      ORDER BY
        t.group_name,
        t.ranking ASC;
      `,
      [maxRound]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


/*
 * GET ONE TEAM
 *
 * Optional:
 *   ?maxRound=3
 *   ?minRound=4
 *
 * Supports:
 *   Group Stage:
 *      /standings/12?maxRound=3
 *
 *   Knockout Stage:
 *      /standings/12?minRound=4
 *
 *   Whole Tournament:
 *      /standings/12
 */
router.get('/:teamId', async (req, res) => {
  try {

    const { teamId } = req.params;

    const maxRound = req.query.maxRound
      ? parseInt(req.query.maxRound, 10)
      : null;

    const minRound = req.query.minRound
      ? parseInt(req.query.minRound, 10)
      : null;

    const result = await pool.query(
      `
      SELECT
        t.id AS team_id,
        t.name AS team_name,
        t.group_name,
        t.ranking,
        t.flag_code,

        COUNT(f.id) AS played,

        COUNT(f.id) FILTER (
          WHERE f.home_team_id = t.id
            AND f.home_score > f.away_score
        )
        +
        COUNT(f.id) FILTER (
          WHERE f.away_team_id = t.id
            AND f.away_score > f.home_score
        ) AS won,

        COUNT(f.id) FILTER (
          WHERE f.home_score = f.away_score
        ) AS drawn,

        COUNT(f.id) FILTER (
          WHERE f.home_team_id = t.id
            AND f.home_score < f.away_score
        )
        +
        COUNT(f.id) FILTER (
          WHERE f.away_team_id = t.id
            AND f.away_score < f.home_score
        ) AS lost,

        COALESCE(
          SUM(
            CASE
              WHEN f.home_team_id = t.id THEN f.home_score
              ELSE f.away_score
            END
          ),
          0
        ) AS goals_for,

        COALESCE(
          SUM(
            CASE
              WHEN f.home_team_id = t.id THEN f.away_score
              ELSE f.home_score
            END
          ),
          0
        ) AS goals_against,

        COALESCE(
          SUM(
            CASE
              WHEN f.home_team_id = t.id
                THEN f.home_score - f.away_score
              ELSE
                f.away_score - f.home_score
            END
          ),
          0
        ) AS goal_difference,

        COALESCE(
          SUM(
            CASE
              WHEN f.home_team_id = t.id
                   AND f.home_score > f.away_score THEN 3
              WHEN f.away_team_id = t.id
                   AND f.away_score > f.home_score THEN 3
              WHEN f.home_score = f.away_score THEN 1
              ELSE 0
            END
          ),
          0
        ) AS points

      FROM teams t

      LEFT JOIN fixtures f
        ON (
             t.id = f.home_team_id
             OR t.id = f.away_team_id
           )
       AND f.status = 'Completed'
       AND (
             $2::int IS NULL
             OR f.round::int <= $2
           )
       AND (
             $3::int IS NULL
             OR f.round::int >= $3
           )

      WHERE t.id = $1

      GROUP BY
        t.id,
        t.name,
        t.group_name,
        t.ranking,
        t.flag_code;
      `,
      [teamId, maxRound, minRound]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Team not found'
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;