/**
 * @file category_routes.js
 * @brief Rutas de la API para la consulta de categorías de libros.
 * @project Bibliotech
 * @author Bautista Romanazzi
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

 const express = require('express');
 const router = express.Router();
 const categoryController = require('../controllers/category_controller');
 const { verifyToken } = require('../middleware/auth_middleware');

 /**
  * @brief Se exige sesión activa (sin isAdmin): el único consumidor es el dashboard
  * del cliente autenticado, así que no hay motivo para exponerla a visitantes (PoLP).
  */
 router.use(verifyToken);

 /**
  * @route GET /api/categories
  * @brief Listar todas las categorías disponibles.
  */
 router.get('/', categoryController.getAllCategories);

 module.exports = router;