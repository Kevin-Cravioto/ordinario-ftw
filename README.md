# ordinario-ftw
Proyecto Final 
Fundamentos de Tecnologías Web
Profesor: Rojano Cáceres José Rafael
Alumno: Cravioto Domínguez Kevin

---

## Enlaces del Proyecto

Sitio Web Desplegado (GitHub Pages): https://kevin-cravioto.github.io/ordinario-ftw/
Video Demostrativo de Navegación: https://youtu.be/rK0HmcO7A2c?si=0HQ7EuXX9Oxy8QYg 

---

## Estructura y Documentación

Este repositorio contiene el código completo de mi catálogo web sobre música, fue desarrollado utilizando HTML5, CSS3, JavaScript y almacenamiento de datos basado en XML para el filtrado dinámico y validación de usuarios.

La documentación que se pedía en la rúbrica se encuentra en la carpeta de `documentacion/`:

Prompts Utilizados: [Ver prompts generadores](./documentacion/prompts-utilizados.txt)
Mockups UI/UX: [Ver carpeta de diseños](./documentacion/mockups/)

---

## Tecnologías Implementadas

Frontend: HTML5 (Etiquetas Semánticas) y CSS3 (Media Queries).
Framework CSS: Bootstrap 5 (Dark Theme).
Lógica y DOM: JavaScript Vanilla (Eventos dinámicos como `keyup`). 
Datos: Fetch API y XML DOM Parsing (`biblioteca.xml`, `usuarios.xml`).


## Características Principales
Búsqueda en Tiempo Real: Al momento de la busqueda de álbumes todo va apareciendo conforme las letras que se escriben sin tener que recargar la página.

Vistas mediante URL: Uso de Parámetros de URL (URLSearchParams) para pasar el ID del álbum seleccionado para ver el detalle de este. Esto permite cargar la información de un álbum en la página de detalles leyendo directamente el XML.

Validación de Usuarios:El Login para seguridad valida los datos ingresados contra un nodo XML que se encuentra en el archivo usuarios.xml 