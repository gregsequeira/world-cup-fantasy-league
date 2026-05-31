const pool = require('../db');
const { isBeforeCutoff } = require('../utils/cutoff');

async function autoAssignTeams() {
  try {
    if (await isBeforeCutoff()) {
      console.log('Cutoff not reached yet, skipping auto-assign.');
      return;
    }

    const users = await pool.query('SELECT id FROM users');
    for (const user of users.rows) {
      const selections = await pool.query(
        'SELECT role FROM user_teams WHERE user_id=$1',
        [user.id]
      );
      const rolesChosen = selections.rows.map(r => r.role);

      const rolesNeeded = ['Favourite','Seeded','DarkHorse','Underdog']
        .filter(r => !rolesChosen.includes(r));

      for (const role of rolesNeeded) {
        const randomTeam = await pool.query(
          'SELECT id FROM teams WHERE category=$1 ORDER BY RANDOM() LIMIT 1',
          [role]
        );
        if (randomTeam.rows.length > 0) {
          await pool.query(
            'INSERT INTO user_teams (user_id, team_id, role) VALUES ($1,$2,$3)',
            [user.id, randomTeam.rows[0].id, role]
          );
          console.log(`Assigned ${role} to user ${user.id}`);
        }
      }
    }
    console.log('Auto-assign complete.');
  } catch (err) {
    console.error('Error in autoAssignTeams:', err);
  }
}

async function scheduleAutoAssign() {
  try {
    const result = await pool.query(
      `SELECT match_date, match_time 
       FROM fixtures 
       ORDER BY match_date ASC, match_time ASC 
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      console.log('No fixtures found, auto-assign not scheduled.');
      return;
    }

    const { match_date, match_time } = result.rows[0];

    // Ensure proper formatting
    const matchDate = typeof match_date === 'string'
      ? match_date
      : match_date.toISOString().split('T')[0];

    let matchTime;
    if (typeof match_time === 'string') {
      matchTime = match_time.length === 5 ? match_time + ':00' : match_time;
    } else {
      matchTime = match_time.toISOString().split('T')[1].slice(0,8);
    }

    const matchDateTime = new Date(`${matchDate}T${matchTime}`);

    if (isNaN(matchDateTime)) {
      console.error('Invalid match date/time:', matchDate, matchTime);
      return;
    }

    const cutoff = new Date(matchDateTime.getTime() - 2 * 60 * 60 * 1000);
    const delay = cutoff.getTime() - Date.now();

    if (delay <= 0) {
      console.log('Cutoff already passed, running auto-assign immediately.');
      autoAssignTeams();
    } else {
      console.log(`Auto-assign scheduled for ${cutoff.toISOString()} (in ${Math.round(delay/60000)} minutes)`);
      setTimeout(autoAssignTeams, delay);
    }
  } catch (err) {
    console.error('Error in scheduleAutoAssign:', err);
  }
}

scheduleAutoAssign();
