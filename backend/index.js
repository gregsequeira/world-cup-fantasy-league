const express = require('express');
const cors = require('cors');
require('dotenv').config();
// require('./jobs/autoSelect'); // start the auto-selection job

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const teamsRouter = require('./routes/teams');       // countries
const fixturesRouter = require('./routes/fixtures');
const standingsRouter = require('./routes/standings');
const authRouter = require('./routes/auth');
const userSelectionsRouter = require('./routes/userSelections'); // group stage selections
const userKnockoutRouter = require('./routes/userKnockout');     // knockout selections
const fantasyRouter = require('./routes/fantasy');   // fantasy leaderboard
const cutoffRouter = require('./routes/cutoff');     // cutoff time
const userScoresRouter = require('./routes/userScores'); // user scores and leaderboard

app.use('/teams', teamsRouter);
app.use('/fixtures', fixturesRouter);
app.use('/standings', standingsRouter);
app.use('/auth', authRouter);
app.use('/userSelections', userSelectionsRouter);
app.use('/userKnockout', userKnockoutRouter);
app.use('/fantasy', fantasyRouter);
app.use('/cutoff', cutoffRouter);
app.use('/userScores', userScoresRouter);
app.use('/user-scores', userScoresRouter);

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// ✅ Health check route for Railway
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
