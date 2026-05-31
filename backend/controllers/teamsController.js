const teamsModel = require('../models/teamsModel');

const getTeams = async (req, res) => {
  try {
    const teams = await teamsModel.getAllTeams();
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const createTeam = async (req, res) => {
  try {
    const { name, ranking, group_name, category, flag_code } = req.body;
    const newTeam = await teamsModel.addTeam(name, ranking, group_name, category, flag_code);
    res.status(201).json(newTeam);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = { getTeams, createTeam };
