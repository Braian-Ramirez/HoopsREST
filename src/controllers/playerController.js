const Player = require('../models/playerModel');
const Joi = require('joi');

const playerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    position: Joi.string().valid('Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center').required(),
    number: Joi.number().integer().min(0).max(99).required(),
    team_id: Joi.number().integer().required()
});

exports.getPlayers = (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const total = Player.count();
    const players = Player.findAll(limit, offset);

    res.json({
        data: players,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
};

exports.createPlayer = (req, res) => {
    const { error } = playerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const id = Player.create(req.body);
        res.status(201).json({ id, ...req.body });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el jugador.' });
    }
};

exports.updatePlayer = (req, res) => {
    const info = Player.update(req.params.id, req.body);
    if (info.changes === 0) return res.status(404).json({ error: 'No encontrado.' });
    res.json({ message: 'Actualizado.' });
};

exports.deletePlayer = (req, res) => {
    const info = Player.delete(req.params.id);
    if (info.changes === 0) return res.status(404).json({ error: 'No encontrado.' });
    res.json({ success: true });
};
