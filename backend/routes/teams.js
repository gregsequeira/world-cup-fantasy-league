const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teamsController');

router.get('/', teamsController.getTeams);
router.post('/', teamsController.createTeam);

module.exports = router;
