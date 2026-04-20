const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const authenticateToken = require('../middlewares/auth');

/**
 * @openapi
 * /api/teams:
 *   get:
 *     tags: [Teams]
 *     summary: Listar equipos
 */
router.get('/', teamController.getTeams);

/**
 * @openapi
 * /api/teams/{id}/players:
 *   get:
 *     tags: [Teams]
 *     summary: Jugadores de un equipo específico
 */
router.get('/:id/players', teamController.getTeamPlayers);

/**
 * @openapi
 * /api/teams:
 *   post:
 *     tags: [Teams]
 *     summary: Crear equipo
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticateToken, teamController.createTeam);

module.exports = router;
