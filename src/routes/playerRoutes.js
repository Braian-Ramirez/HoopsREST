const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const authenticateToken = require('../middlewares/auth');

/**
 * @openapi
 * /api/players:
 *   get:
 *     tags: [Players]
 *     summary: Listar jugadores paginados
 */
router.get('/', playerController.getPlayers);

/**
 * @openapi
 * /api/players:
 *   post:
 *     tags: [Players]
 *     summary: Crear jugador
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticateToken, playerController.createPlayer);

/**
 * @openapi
 * /api/players/{id}:
 *   put:
 *     tags: [Players]
 *     summary: Actualizar jugador
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authenticateToken, playerController.updatePlayer);

/**
 * @openapi
 * /api/players/{id}:
 *   delete:
 *     tags: [Players]
 *     summary: Eliminar jugador
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authenticateToken, playerController.deletePlayer);

module.exports = router;
