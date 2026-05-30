document.addEventListener("DOMContentLoaded", () => {
    // Verificamos si estamos en la página del catálogo
    const contenedorCatalogo = document.getElementById("contenedor-catalogo");
    
    // Si el contenedor existe, ejecutamos la función para leer el XML
    if (contenedorCatalogo) {
        cargarCatalogo(contenedorCatalogo);
        
        // Lógica del buscador en tiempo real
        const buscador = document.getElementById("buscador");
        if (buscador) {
            buscador.addEventListener("keyup", function() {
                // Convertimos el texto a minúsculas para que sea más fácil buscar
                const textoBusqueda = this.value.toLowerCase();
                
                // Seleccionamos todas las tarjetas (columnas) que se generaron
                const tarjetas = document.querySelectorAll("#contenedor-catalogo .col");
                
                tarjetas.forEach(tarjeta => {
                    // Extraemos el texto del título y del artista de cada tarjeta
                    const titulo = tarjeta.querySelector(".card-title").textContent.toLowerCase();
                    const artista = tarjeta.querySelector(".card-text").textContent.toLowerCase();
                    
                    // Si lo que se escribe coincide con el título o el artista, se muestra; si no, se oculta
                    if (titulo.includes(textoBusqueda) || artista.includes(textoBusqueda)) {
                        tarjeta.style.display = "block";
                    } else {
                        tarjeta.style.display = "none";
                    }
                });
            });
        }
    }
});

function cargarCatalogo(contenedor) {
    fetch("../xml/biblioteca.xml")
        .then(respuesta => respuesta.text())
        .then(datosXML => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(datosXML, "application/xml");
            
            // Obtenemos todos los elementos <album>
            const albumes = xml.getElementsByTagName("album");
            
            // Limpiamos el mensaje de carga que tenías en el HTML
            contenedor.innerHTML = "";
            
            // Recorremos cada álbum de tu base de datos XML
            for (let i = 0; i < albumes.length; i++) {
                let album = albumes[i];
                
                // Extraemos los datos de cada etiqueta
                let id = album.getAttribute("id");
                let titulo = album.getElementsByTagName("titulo")[0].textContent;
                let artista = album.getElementsByTagName("artista")[0].textContent;
                let anio = album.getElementsByTagName("anio")[0].textContent;
                let portada = album.getElementsByTagName("portada")[0].textContent;
                let calificacion = parseInt(album.getElementsByTagName("calificacion")[0].textContent);
                
                // Lógica matemática para crear las estrellas según la calificación
                let estrellas = "";
                for (let j = 1; j <= 5; j++) {
                    if (j <= calificacion) {
                        estrellas += "★"; // Estrella llena
                    } else {
                        estrellas += "☆"; // Estrella vacía
                    }
                }
                
                let tarjetaHTML = `
                    <div class="col">
                        <div class="card h-100 bg-dark border-purple">
                            <!-- La imagen jala la ruta de tu XML (ej. ../img/dinastia.jpg) -->
                            <img src="${portada}" class="card-img-top" alt="Portada de ${titulo}" style="aspect-ratio: 1/1; object-fit: cover;">
                            <div class="card-body text-center">
                                <h5 class="card-title text-light">${titulo}</h5>
                                <p class="card-text text-secondary mb-1">${artista}</p>
                                <p class="card-text small text-muted">${anio}</p>
                                <div class="text-purple mb-3 fs-5">${estrellas}</div>
                                <a href="detalle.html?id=${id}" class="btn btn-outline-purple btn-sm rounded-pill px-3">Ver Detalle</a>
                            </div>
                        </div>
                    </div>
                `;
                
                // Inyectamos la tarjeta recién armada en el grid de Bootstrap
                contenedor.innerHTML += tarjetaHTML;
            }
        })
        .catch(error => {
            console.error("Hubo un error al cargar el XML:", error);
            contenedor.innerHTML = `<p class="text-danger text-center">Error al cargar el catálogo. Revisa que el archivo XML esté bien escrito.</p>`;
        });
}