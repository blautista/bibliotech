/**
 * @file audit_repository.js
 * @brief Repositorio para la capa de acceso a datos del registro de auditoría (Accounting).
 * @project Bibliotech
 * @author Bautista Romanazzi
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Noviembre 2026
 */

/**
 * @details A diferencia de un console.log, que se pierde al reiniciar el proceso,
 * persistir las acciones críticas en la base de datos permite un análisis forense
 * posterior (quién hizo qué, sobre qué recurso, desde qué IP y cuándo).
 */
 const db = require('../config/db');

 /**
  * @class AuditRepository
  * @brief Registra las acciones críticas encapsulando la llamada al Procedimiento Almacenado.
  */
 class AuditRepository
 {
     /**
      * @brief Persiste una nueva entrada en el registro de auditoría.
      * @param {Object} logData - DTO con user_id (actor), action (ej: DELETE_BOOK), target (ej: book:5) e ip_address.
      * @returns {Promise<number>} Retorna el ID (Primary Key) del registro insertado.
      *
      * @note Este método no atrapa sus propios errores: igual que el resto de los repositorios,
      * devuelve la promesa y deja que el controlador decida cómo manejar un fallo.
      */
     async create(logData)
     {
         const { user_id, action, target, ip_address } = logData;
         const [rows] = await db.execute('CALL sp_create_audit_log(?, ?, ?, ?)',
             [user_id, action, target, ip_address]);

         return rows[0][0].insertId;
     }
 }

 module.exports = new AuditRepository();