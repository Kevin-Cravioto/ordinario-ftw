document.addEventListener("DOMContentLoaded", () => {
    // Inicializar catálogo
    const contenedorCatalogo = document.getElementById("contenedor-catalogo");
    if (contenedorCatalogo) {
        cargarCatalogo(contenedorCatalogo);
        
        // Inicializar buscador
        const buscador = document.getElementById("buscador");
        if (buscador) {
            buscador.addEventListener("keyup", function() {
                const textoBusqueda = this.value.toLowerCase();
                const tarjetas = document.querySelectorAll("#contenedor-catalogo .col");
                
                tarjetas.forEach(tarjeta => {
                    const titulo = tarjeta.querySelector(".card-title").textContent.toLowerCase();
                    const artista = tarjeta.querySelector(".card-text").textContent.toLowerCase();
                    
                    if (titulo.includes(textoBusqueda) || artista.includes(textoBusqueda)) {
                        tarjeta.style.display = "block";
                    } else {
                        tarjeta.style.display = "none";
                    }
                });
            });
        }
    }
    
    // Inicializar vista de detalle
    const contenedorDetalle = document.getElementById("contenedor-detalle");
    if (contenedorDetalle) {
        cargarDetalle(contenedorDetalle);
    }


    // Inicializar login
    const formLogin = document.getElementById("form-login");
    if (formLogin) {
        formLogin.addEventListener("submit", validarLogin);
    }

});

function cargarCatalogo(contenedor) {
    fetch("../xml/biblioteca.xml")
        .then(respuesta => respuesta.text())
        .then(datosXML => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(datosXML, "application/xml");
            const albumes = xml.getElementsByTagName("album");
            
            contenedor.innerHTML = "";
            
            for (let i = 0; i < albumes.length; i++) {
                let album = albumes[i];
                let id = album.getAttribute("id");
                let titulo = album.getElementsByTagName("titulo")[0].textContent;
                let artista = album.getElementsByTagName("artista")[0].textContent;
                let anio = album.getElementsByTagName("anio")[0].textContent;
                let portada = album.getElementsByTagName("portada")[0].textContent;
                let calificacion = parseInt(album.getElementsByTagName("calificacion")[0].textContent);
                
                // Generar estrellas
                let estrellas = "";
                for (let j = 1; j <= 5; j++) {
                    estrellas += (j <= calificacion) ? "★" : "☆";
                }
                
                let tarjetaHTML = `
                    <div class="col">
                        <div class="card h-100 bg-dark border-purple">
                            <img src="${portada}" class="card-img-top" alt="Portada" style="aspect-ratio: 1/1; object-fit: cover;">
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
                contenedor.innerHTML += tarjetaHTML;
            }
        })
        .catch(error => console.error("Error al cargar el XML:", error));
}

function cargarDetalle(contenedor) {
    // Obtener ID del álbum desde la URL
    const parametrosURL = new URLSearchParams(window.location.search);
    const idAlbum = parametrosURL.get("id");

    if (!idAlbum) {
        contenedor.innerHTML = `<div class="text-center my-5"><h3 class="text-danger">No se especificó un álbum.</h3><a href="catalogo.html" class="btn btn-outline-purple mt-3">Regresar al catálogo</a></div>`;
        return;
    }

    fetch("../xml/biblioteca.xml")
        .then(respuesta => respuesta.text())
        .then(datosXML => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(datosXML, "application/xml");
            const albumes = xml.getElementsByTagName("album");
            
            let albumEncontrado = null;

            // Buscar el álbum por ID
            for (let i = 0; i < albumes.length; i++) {
                if (albumes[i].getAttribute("id") === idAlbum) {
                    albumEncontrado = albumes[i];
                    break;
                }
            }

            if (!albumEncontrado) {
                contenedor.innerHTML = `<div class="text-center my-5"><h3 class="text-danger">Álbum no encontrado.</h3><a href="catalogo.html" class="btn btn-outline-purple mt-3">Regresar</a></div>`;
                return;
            }

            // Extraer datos del álbum
            let titulo = albumEncontrado.getElementsByTagName("titulo")[0].textContent;
            let artista = albumEncontrado.getElementsByTagName("artista")[0].textContent;
            let anio = albumEncontrado.getElementsByTagName("anio")[0].textContent;
            let genero = albumEncontrado.getElementsByTagName("genero")[0].textContent;
            let portada = albumEncontrado.getElementsByTagName("portada")[0].textContent;
            let calificacion = parseInt(albumEncontrado.getElementsByTagName("calificacion")[0].textContent);

            let estrellas = "";
            for (let j = 1; j <= 5; j++) {
                estrellas += (j <= calificacion) ? "★" : "☆";
            }

            // Extraer canciones
            let cancionesXML = albumEncontrado.getElementsByTagName("cancion");
            let listaCancionesHTML = "";

            for (let k = 0; k < cancionesXML.length; k++) {
                let numero = k + 1;
                let nombre = cancionesXML[k].getElementsByTagName("nombre")[0].textContent;
                let duracion = cancionesXML[k].getElementsByTagName("duracion")[0].textContent;
                let califCancion = parseInt(cancionesXML[k].getElementsByTagName("calificacion")[0].textContent);
                
                let estrellasCancion = "";
                for (let m = 1; m <= 5; m++) {
                    estrellasCancion += (m <= califCancion) ? "★" : "☆";
                }

                listaCancionesHTML += `
                    <tr>
                        <th scope="row" class="text-secondary">${numero}</th>
                        <td class="text-light fw-bold">${nombre}</td>
                        <td class="text-secondary text-center">${duracion}</td>
                        <td class="text-purple text-end">${estrellasCancion}</td>
                    </tr>
                `;
            }

            // Renderizar la vista de detalle
            contenedor.innerHTML = `
                <div class="row mt-3">
                    <div class="col-md-4 text-center mb-4">
                        <img src="${portada}" class="img-fluid rounded shadow-lg border border-purple mb-3" style="max-width: 300px; aspect-ratio: 1/1; object-fit: cover;">
                        <h2 class="text-light fw-bold mb-1">${titulo}</h2>
                        <h4 class="text-purple mb-3">${artista}</h4>
                        <div class="d-flex justify-content-center gap-3 mb-3">
                            <span class="badge bg-secondary px-3 py-2">${genero}</span>
                            <span class="badge border border-secondary text-secondary px-3 py-2">${anio}</span>
                        </div>
                        <div class="text-purple fs-3 mb-4">${estrellas}</div>
                        <a href="catalogo.html" class="btn btn-outline-light rounded-pill px-4">← Volver al catálogo</a>
                    </div>
                    
                    <div class="col-md-8">
                        <div class="card bg-dark border-purple">
                            <div class="card-header bg-transparent border-purple">
                                <h5 class="text-light mb-0 mt-2">Tracklist Oficial</h5>
                            </div>
                            <div class="card-body p-0">
                                <div class="table-responsive">
                                    <table class="table table-dark table-hover mb-0 align-middle">
                                        <thead>
                                            <tr>
                                                <th scope="col" class="text-purple" style="width: 10%;">#</th>
                                                <th scope="col" class="text-purple" style="width: 50%;">Canción</th>
                                                <th scope="col" class="text-purple text-center" style="width: 20%;">Duración</th>
                                                <th scope="col" class="text-purple text-end" style="width: 20%;">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${listaCancionesHTML}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error("Error al cargar los detalles:", error);
            contenedor.innerHTML = `<p class="text-danger text-center">Error al conectar con la base de datos.</p>`;
        });
}


function validarLogin(evento) {
    // Evitar que el formulario recargue la página
    evento.preventDefault();
    
    const userIngresado = document.getElementById("input-usuario").value.trim();
    const passIngresado = document.getElementById("input-password").value.trim();
    const mensajeError = document.getElementById("mensaje-error");

    fetch("../xml/usuarios.xml")
        .then(respuesta => respuesta.text())
        .then(datosXML => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(datosXML, "application/xml");
            const usuarios = xml.getElementsByTagName("usuario");
            
            let accesoConcedido = false;

            // Comprobar credenciales contra el XML
            for (let i = 0; i < usuarios.length; i++) {
                let nombreXML = usuarios[i].getElementsByTagName("nombre")[0].textContent;
                let passXML = usuarios[i].getElementsByTagName("password")[0].textContent;

                if (userIngresado === nombreXML && passIngresado === passXML) {
                    accesoConcedido = true;
                    break;
                }
            }

            if (accesoConcedido) {
                // Redirigir al catálogo si los datos son correctos
                window.location.href = "catalogo.html";
            } else {
                // Mostrar alerta de error
                mensajeError.classList.remove("d-none");
            }
        })
        .catch(error => console.error("Error al leer usuarios.xml:", error));
}