const Team = require('../models/teamModel');

exports.getTeams = (req, res) => {
    const teams = Team.findAll();
    res.json(teams);
};

exports.getTeamPlayers = (req, res) => {
    const team = Team.findById(req.params.id);
    if (!team) return res.status(404).json({ error: 'Equipo no encontrado.' });
    const players = Team.findPlayersByTeam(req.params.id);
    res.json({ team, players });
};

exports.createTeam = (req, res) => {
    const { name, city } = req.body;
    try {
        const id = Team.create(name, city);
        res.status(201).json({ id, name, city });
    } catch (err) {
        res.status(400).json({ error: 'El equipo ya existe.' });
    }
};
