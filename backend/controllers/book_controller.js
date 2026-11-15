/**
 * @file book_controller.js
 * @brief Controlador para la gestión documental, carga y borrado de archivos PDF.
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

 const fileHelper = require('../utils/file_helper/file_helper');
 const bookRepository = require('../repositories/book_repository');
 const auditRepository = require('../repositories/audit_repository');
 const i18n = require('../utils/i18n/i18n'); // Inyección del gestor de idiomas
 
 /**
  * @class BookController
  * @brief Administra la interacción del cliente con su biblioteca privada.
  */
 class BookController 
 {
     /**
      * @brief Sube un libro PDF y guarda sus metadatos en la base de datos.
      * @param {Object} req - Petición HTTP Multipart.
      * @param {Object} res - Respuesta HTTP.
      * @param {Function} next - Función para delegar errores al Global Error Handler.
      */
     async uploadBook(req, res, next) 
     {
         try 
         {
             const { title, author, category_id, pages } = req.body;
             const userId = req.userId;
             const filename = req.file.filename;
             const filePath = `/uploads/${filename}`;
 
             // Persistencia de metadatos mediante Stored Procedure
             const insertId = await bookRepository.create({
                 user_id: userId,
                 filename,
                 title,
                 author,
                 category_id: parseInt(category_id),
                 pages: parseInt(pages) || 0,
                 file_path: filePath
             });
 
             const message = i18n.getMessage('CT_BOOK_UPLOAD_SUCCESS');
             res.status(201).json({ message, id: insertId, path: filePath });
         } 
         catch (error) 
         {
             // Regla de Integridad: Limpieza física preventiva si la base de datos falla
             if (req.file) 
             {
                 fileHelper.deleteFile(`/uploads/${req.file.filename}`);
             }
             next(error);
         }
     }
 
     /**
      * @brief Lista todos los libros pertenecientes al usuario autenticado.
      * @param {Object} req - Petición HTTP.
      * @param {Object} res - Respuesta HTTP.
      * @param {Function} next - Función para delegar errores.
      */
     async getMyBooks(req, res, next)
     {
         try 
         {
             const books = await bookRepository.findByUserId(req.userId);
             res.json(books);
         } 
         catch (error) 
         {
             next(error);
         }
     }
 
     /**
      * @brief Elimina un documento específico validando previamente la propiedad del mismo.
      * @param {Object} req - Petición HTTP.
      * @param {Object} res - Respuesta HTTP.
      * @param {Function} next - Función para delegar errores.
      */
     async deleteBook(req, res, next) 
     {
         try 
         {
             const { id } = req.params;
             const userId = req.userId;
 
             // Obtener información del libro para validar propiedad y conocer ruta física
             const book = await bookRepository.findById(id, userId);
             
             if (!book) 
             {
                 const message = i18n.getMessage('CT_BOOK_NOT_FOUND');
                 return res.status(404).json({ message });
             }
 
             // Eliminar registro en base de datos
             await bookRepository.delete(id, userId);
 
             // Eliminar archivo físico en disco de forma síncrona
             fileHelper.deleteFile(book.file_path); 
             
             // Auditoría asincrónica (fire-and-forget): sin await para no demorar la respuesta, y con .catch para que un fallo del log no rompa la petición
             auditRepository.create({ user_id: userId, action: 'DELETE_BOOK', target: 'book', target_id: id, ip_address: req.ip })
                 .catch(error => console.error(`❌ Error al registrar auditoría: ${error.message}`));
             
             const message = i18n.getMessage('CT_BOOK_DELETED_SUCCESS');
             res.json({ message });
         }
         catch (error)
         {
             next(error);
         }
     }

     /**
      * @brief Edita los metadatos de un documento validando previamente la propiedad del mismo.
      * @param {Object} req - Petición HTTP (JSON con title, author, category_id y pages).
      * @param {Object} res - Respuesta HTTP.
      * @param {Function} next - Función para delegar errores.
      */
     async updateBook(req, res, next)
     {
         try
         {
             const { id } = req.params;
             const userId = req.userId;
             const { title, author, category_id, pages } = req.body;

             // Validar propiedad: el SP ignora en silencio los libros ajenos, por eso se verifica antes
             const book = await bookRepository.findById(id, userId);

             if (!book)
             {
                 const message = i18n.getMessage('CT_BOOK_NOT_FOUND');
                 return res.status(404).json({ message });
             }

             // Actualizar metadatos mediante Stored Procedure (el archivo físico no se modifica)
             await bookRepository.update(id, userId, {
                 title,
                 author,
                 category_id: parseInt(category_id),
                 pages: parseInt(pages) || 0
             });

             // Auditoría asincrónica (fire-and-forget): sin await para no demorar la respuesta, y con .catch para que un fallo del log no rompa la petición
             auditRepository.create({ user_id: userId, action: 'UPDATE_BOOK', target: 'book', target_id: id, ip_address: req.ip })
                 .catch(error => console.error(`❌ Error al registrar auditoría: ${error.message}`));

             const message = i18n.getMessage('CT_BOOK_UPDATE_SUCCESS');
             res.json({ message });
         }
         catch (error)
         {
             next(error);
         }
     }
 }
 
 module.exports = new BookController();