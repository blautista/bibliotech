/**
 * @file category_repository.js
 * @brief Repositorio para la capa de acceso a datos de las categorías de libros.
 * @project Bibliotech
 * @author Bautista Romanazzi
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

/**
 * @details Las categorías son una tabla maestra (como roles): al leerlas desde la base
 * en vez de hardcodearlas en el HTML, agregar una nueva no requiere tocar el frontend.
 */
 const db = require('../config/db');

 /**
  * @class CategoryRepository
  * @brief Expone las categorías disponibles encapsulando la llamada al Procedimiento Almacenado.
  */
 class CategoryRepository
 {
     /**
      * @brief Retorna la lista completa de categorías.
      * @returns {Promise<Array>} Array de objetos con id y name, ordenados por nombre desde el SP.
      */
     async findAll()
     {
         const [rows] = await db.execute('CALL sp_get_all_categories()');
         return rows[0];
     }
 }

 module.exports = new CategoryRepository();