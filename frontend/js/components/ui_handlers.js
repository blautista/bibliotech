/**
 * @file ui_handlers.js
 * @brief Componentes de interfaz gráfica dinámica construidos en memoria (Zero innerHTML).
 * @project Bibliotech
 * @author Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
 * @license http://www.gnu.org/licenses/gpl.txt GNU GPL 3.0
 * @date Octubre 2026
 */

/**
 * @brief Construye y muestra una ventana de diálogo modal informativa.
 * @details Manipulación estricta del DOM: Al usar document.createElement() y textContent, 
 * blindamos la aplicación contra inyección de código (XSS). El texto se renderiza como 
 * dato puro, nunca como HTML ejecutable.
 * @param {string} title - Título del cuadro de diálogo.
 * @param {string} message - Mensaje o cuerpo de la alerta.
 */
 function showModal(title, message) 
 {
     let modal = document.getElementById('msgModal');
 
     // Patrón Singleton aplicado al DOM: Solo creamos los elementos si no existen previamente
     if (!modal) 
     {
         modal = document.createElement('div');
         modal.id = 'msgModal';
         modal.className = 'w3-modal';
 
         const content = document.createElement('div');
         content.className = 'w3-modal-content w3-card-4 w3-animate-zoom vault-card';
         content.style.maxWidth = '400px';
 
         const header = document.createElement('header');
         header.className = 'w3-container w3-border-bottom';
 
         const titleElem = document.createElement('h3');
         titleElem.id = 'modalTitle';
         header.appendChild(titleElem);
 
         const bodyDiv = document.createElement('div');
         bodyDiv.className = 'w3-container w3-padding';
 
         const msgElem = document.createElement('p');
         msgElem.id = 'modalBody';
         
         const btnClose = document.createElement('button');
         btnClose.className = 'w3-button w3-right w3-teal w3-margin-bottom'; 
         btnClose.textContent = 'Cerrar';
         
         // Asignación de eventos mediante Listeners (más limpio que usar el atributo onclick en HTML)
         btnClose.addEventListener('click', () => 
         {
             modal.style.display = 'none';
         });
 
         // Ensamblaje del árbol DOM: De adentro hacia afuera
         bodyDiv.appendChild(msgElem);
         bodyDiv.appendChild(btnClose);
         content.appendChild(header);
         content.appendChild(bodyDiv);
         modal.appendChild(content);
         document.body.appendChild(modal);
     }
 
     // Actualizamos el contenido dinámico reutilizando los nodos existentes
     document.getElementById('modalTitle').textContent = title;
     document.getElementById('modalBody').textContent = message;
     modal.style.display = 'block';
 }
 
 /**
  * @brief Muestra una ventana modal conteniendo un visor de PDF interactivo.
  * @param {string} title - Título del documento.
  * @param {string} pdfUrl - Ruta física del archivo en el servidor.
  */
 function showPdfModal(title, pdfUrl) 
 {
     let modal = document.getElementById('pdfModal');
 
     if (!modal) 
     {
         modal = document.createElement('div');
         modal.id = 'pdfModal';
         modal.className = 'w3-modal';
         modal.style.zIndex = '9999';
 
         const content = document.createElement('div');
         content.className = 'w3-modal-content w3-card-4 w3-animate-zoom vault-card';
         content.style.width = '85%';
         content.style.maxWidth = '950px';
 
         const header = document.createElement('header');
         header.className = 'w3-container w3-border-bottom w3-padding w3-display-container';
 
         const titleElem = document.createElement('h3');
         titleElem.id = 'pdfModalTitle';
         titleElem.className = 'w3-margin-0 w3-text-teal';
         header.appendChild(titleElem);
 
         // Botón de cerrar posicionado absolutamente. 
         // Zero-innerHTML: Usamos el carácter Unicode '×' nativo en textContent.
         const btnCloseHeader = document.createElement('span');
         btnCloseHeader.className = 'w3-button w3-display-topright w3-hover-red';
         btnCloseHeader.textContent = '×'; 
         btnCloseHeader.style.fontSize = '24px';
         btnCloseHeader.addEventListener('click', () => 
         {
             modal.style.display = 'none';
             const iframe = document.getElementById('pdfIframe');
             // Al vaciar el src, detenemos la descarga en segundo plano del PDF
             if (iframe) 
             {
                 iframe.src = '';
             }
         });
         header.appendChild(btnCloseHeader);
 
         const bodyDiv = document.createElement('div');
         bodyDiv.className = 'w3-container w3-padding-0';
 
         const iframe = document.createElement('iframe');
         iframe.id = 'pdfIframe';
         iframe.style.width = '100%';
         iframe.style.height = '75vh';
         iframe.style.border = 'none';
         
         bodyDiv.appendChild(iframe);
         content.appendChild(header);
         content.appendChild(bodyDiv);
         modal.appendChild(content);
         document.body.appendChild(modal);
     }
 
     document.getElementById('pdfModalTitle').textContent = title;
     document.getElementById('pdfIframe').src = pdfUrl;
     modal.style.display = 'block';
 }

 /**
  * @brief Muestra una ventana modal con un formulario para editar los metadatos de un documento.
  * @details El modal solo construye la interfaz y recolecta los datos; la petición HTTP queda
  * a cargo del controlador frontend mediante el callback onSave (Separación de Responsabilidades).
  * @param {Object} book - Libro a editar (title, author, category, pages).
  * @param {Function} onSave - Callback que recibe el objeto con los metadatos actualizados.
  */
 function showEditBookModal(book, onSave)
 {
     let modal = document.getElementById('editBookModal');

     if (!modal)
     {
         modal = document.createElement('div');
         modal.id = 'editBookModal';
         modal.className = 'w3-modal';

         const content = document.createElement('div');
         content.className = 'w3-modal-content w3-card-4 w3-animate-zoom vault-card';
         content.style.maxWidth = '500px';

         const header = document.createElement('header');
         header.className = 'w3-container w3-border-bottom w3-padding w3-display-container';

         const titleElem = document.createElement('h3');
         titleElem.className = 'w3-margin-0 w3-text-teal';
         titleElem.textContent = 'Editar Documento';
         header.appendChild(titleElem);

         const btnCloseHeader = document.createElement('span');
         btnCloseHeader.className = 'w3-button w3-display-topright w3-hover-red';
         btnCloseHeader.textContent = '×';
         btnCloseHeader.style.fontSize = '24px';
         btnCloseHeader.addEventListener('click', () =>
         {
             modal.style.display = 'none';
         });
         header.appendChild(btnCloseHeader);

         // Se usa un <form> para aprovechar la validación nativa del navegador (required, min)
         const form = document.createElement('form');
         form.id = 'editBookForm';
         form.className = 'w3-container w3-padding';

         const lblTitle = document.createElement('label');
         lblTitle.textContent = 'Título del Documento';
         const inputTitle = document.createElement('input');
         inputTitle.id = 'editTitle';
         inputTitle.type = 'text';
         inputTitle.required = true;
         inputTitle.className = 'w3-input w3-border w3-round w3-transparent w3-text-white';

         const lblAuthor = document.createElement('label');
         lblAuthor.className = 'w3-margin-top w3-show';
         lblAuthor.textContent = 'Autor';
         const inputAuthor = document.createElement('input');
         inputAuthor.id = 'editAuthor';
         inputAuthor.type = 'text';
         inputAuthor.required = true;
         inputAuthor.className = 'w3-input w3-border w3-round w3-transparent w3-text-white';

         const lblCategory = document.createElement('label');
         lblCategory.className = 'w3-margin-top w3-show';
         lblCategory.textContent = 'Categoría';
         const selectCategory = document.createElement('select');
         selectCategory.id = 'editCategory';
         selectCategory.className = 'w3-select w3-border w3-round w3-black w3-text-white';

         const lblPages = document.createElement('label');
         lblPages.className = 'w3-margin-top w3-show';
         lblPages.textContent = 'Páginas';
         const inputPages = document.createElement('input');
         inputPages.id = 'editPages';
         inputPages.type = 'number';
         inputPages.min = '1';
         inputPages.required = true;
         inputPages.className = 'w3-input w3-border w3-round w3-transparent w3-text-white';

         const btnSave = document.createElement('button');
         btnSave.type = 'submit';
         btnSave.className = 'w3-button w3-teal w3-block w3-round-large w3-margin-top w3-margin-bottom';
         btnSave.textContent = 'GUARDAR CAMBIOS';

         form.append(lblTitle, inputTitle, lblAuthor, inputAuthor, lblCategory, selectCategory, lblPages, inputPages, btnSave);
         content.appendChild(header);
         content.appendChild(form);
         modal.appendChild(content);
         document.body.appendChild(modal);
     }

     /**
      * @note Las opciones se copian del <select id="category"> del formulario de carga en cada apertura.
      * Así se evita duplicar la lista de categorías y el modal refleja siempre las mismas opciones.
      */
     const selectCategory = document.getElementById('editCategory');
     const options = Array.from(document.querySelectorAll('#category option')).map(opt =>
     {
         const option = document.createElement('option');
         option.value = opt.value;
         option.textContent = opt.textContent;
         return option;
     });
     selectCategory.replaceChildren(...options);

     document.getElementById('editTitle').value = book.title;
     document.getElementById('editAuthor').value = book.author;
     selectCategory.value = book.category;
     document.getElementById('editPages').value = book.pages;

     /**
      * @note Se reasigna onsubmit (en lugar de addEventListener) porque el modal es un Singleton:
      * sumar un listener en cada apertura acumularía callbacks y enviaría varias peticiones.
      */
     document.getElementById('editBookForm').onsubmit = (e) =>
     {
         e.preventDefault();
         modal.style.display = 'none';
         onSave({
             title: document.getElementById('editTitle').value,
             author: document.getElementById('editAuthor').value,
             category: selectCategory.value,
             pages: document.getElementById('editPages').value
         });
     };

     modal.style.display = 'block';
 }