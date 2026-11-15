/**
 * @file category_controller.js
 * @brief Controlador para la consulta de las categorías de libros.
 * @project Bibliotech
 * @author Bautista Romanazzi
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

 const categoryRepository = require('../repositories/category_repository');

 /**
  * @class CategoryController
  * @brief Provee al frontend las categorías con las que construye dinámicamente sus <select>.
  */
 class CategoryController
 {
     /**
      * @brief Obtiene la lista completa de categorías.
      * @param {Object} req - Petición HTTP.
      * @param {Object} res - Respuesta HTTP.
      * @param {Function} next - Función para delegar errores al Global Error Handler.
      */
     async getAllCategories(req, res, next)
     {
         try
         {
             const categories = await categoryRepository.findAll();
             res.json(categories);
         }
         catch (error)
         {
             next(error);
         }
     }
 }

 module.exports = new CategoryController();