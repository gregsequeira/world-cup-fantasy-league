const pool = require('./db');

const getAllTeams = async () => {
  const result = await pool.query('SELECT * FROM teams ORDER BY group_name, ranking');
  return result.rows;
};

const addTeam = async (name, ranking, group_name, category, flag_code) => {
  const result = await pool.query(
    'INSERT INTO teams (name, ranking, group_name, category, flag_code) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, ranking, group_name, category, flag_code]
  );
  return result.rows[0];
};

module.exports = { getAllTeams, addTeam };
