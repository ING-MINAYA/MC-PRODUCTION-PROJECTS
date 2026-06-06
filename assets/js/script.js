// ==========================================
// 1. MENÚ MÓVIL (Hamburguesa) MEJORADO
// ==========================================
const iconoMenu = document.getElementById('icono-menu');
const menu = document.getElementById('menu');
const enlacesMenu = document.querySelectorAll('#menu li a'); 

document.addEventListener('DOMContentLoaded', function() {
    const selectorCategoria = document.getElementById('categoria-track'); 
    const inputAudio = document.getElementById('audio-track'); 
    const textoMultiples = document.getElementById('texto-multiples');

    // Creamos una función que revisa en qué estado está el menú
    function evaluarCategoria() {
        if(selectorCategoria.value === 'ALBUMES') {
            inputAudio.setAttribute('multiple', 'true');
            if(textoMultiples) textoMultiples.style.display = 'block';
        } else {
            inputAudio.removeAttribute('multiple');
            if(textoMultiples) textoMultiples.style.display = 'none';
        }
    }

    if(selectorCategoria && inputAudio) {
        // 1. Revisar inmediatamente al cargar la página
        evaluarCategoria();
        
        // 2. Revisar cada vez que el usuario cambie la opción
        selectorCategoria.addEventListener('change', evaluarCategoria);
    } else {
        console.log("Error: No se encontró el selector o el input de audio.");
    }
});

if (iconoMenu) {
    iconoMenu.addEventListener('click', () => {
        menu.classList.toggle('activo');
        if (menu.classList.contains('activo')) {
            iconoMenu.classList.replace('bx-menu', 'bx-x');
        } else {
            iconoMenu.classList.replace('bx-x', 'bx-menu'); 
        }
    });

    enlacesMenu.forEach(enlace => {
        enlace.addEventListener('click', () => {
            menu.classList.remove('activo');
            iconoMenu.classList.replace('bx-x', 'bx-menu');
        });
    });
}

// ==========================================
// 2. NOTIFICACIÓN FLOTANTE ELEGANTE
// ==========================================
const notificacion = document.createElement('div');
notificacion.id = 'notificacion-custom';
notificacion.innerHTML = `<i class='bx bx-info-circle' style='font-size: 24px;'></i> <span id="texto-notificacion"></span>`;
document.body.appendChild(notificacion);

function mostrarAlertaElegante(mensaje) {
    document.getElementById('texto-notificacion').textContent = mensaje;
    notificacion.classList.add('mostrar'); 
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
    }, 4000);
}

// ==========================================
// 3. BASE DE DATOS AVANZADA (IndexedDB)
// ==========================================
const dbName = "MC_Productions_DB";
const storeName = "catalogo_musica";

function abrirBaseDeDatos() {
    return new Promise((resolve, reject) => {
        const conexion = indexedDB.open(dbName, 1);
        conexion.onupgradeneeded = (evento) => {
            const db = evento.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: "id" });
            }
        };
        conexion.onsuccess = () => resolve(conexion.result);
        conexion.onerror = () => reject(conexion.error);
    });
}

function leerArchivoComoURL(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.readAsDataURL(archivo);
        lector.onload = () => resolve(lector.result);
        lector.onerror = (error) => reject(error);
    });
}

// ==========================================
// 4. LÓGICA DEL CARRITO DE COMPRAS UNIFICADA
// ==========================================
let carrito = JSON.parse(localStorage.getItem('mc_carrito')) || [];

// A) AGREGAR PRODUCTO (Adelgazado para no romper la memoria)
function agregarAlCarrito(producto) { 

    // ===============================================
    // 🚨 GUARDIA DE SEGURIDAD PARA AGREGAR AL CARRITO
    // ===============================================
    const usuarioActivo = localStorage.getItem('usuario_mc_activo');
    if (!usuarioActivo) {
        alert("🔒 Crea una cuenta o inicia sesión para agregar música al carrito.");
        window.location.href = '/assets/pages/login.html';
        return; // Detenemos la función aquí mismo para que no haga nada más
    }
    // ===============================================

    // Si el usuario sí está logueado, el código sigue su curso normal:
    const yaExiste = carrito.find(item => item.id === producto.id);
    
    if (yaExiste) {
        mostrarAlertaElegante(`⚠️ ${producto.titulo} ya está en tu carrito.`);
        return; 
    } 

    // 🚀 Creamos una copia ligera sin el MP3
    const productoLigero = {
    id: producto.id,
    titulo: producto.titulo,
    artista: producto.artista,
    precio: parseFloat(producto.precio), // Aseguramos que sea un número
    categoria: producto.categoria
    // 🚫 MIRA CÓMO NO PONEMOS NI 'img' NI 'audio' AQUÍ ADENTRO 🚫
};

    carrito.push(productoLigero);

try {
    localStorage.setItem('mc_carrito', JSON.stringify(carrito));
    mostrarAlertaElegante(`✅ ¡${producto.titulo} agregado al carrito!`);
} catch (error) {
    console.error("El error fue:", error);
    mostrarAlertaElegante("⚠️ Error: El carrito está lleno, vacíalo para continuar.");
}
}

// B) DIBUJAR PANTALLA DEL CARRITO
const contenedorCarrito = document.getElementById('lista-carrito');
const elementoTotal = document.querySelector('.total-precio');

function actualizarPantallaCarrito() {
    if (!contenedorCarrito) return; 

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `
            <div class="carrito-vacio" style="text-align: center; padding: 50px 20px;">
                <i class='bx bx-cart' style="font-size: 60px; color: var(--texto-secundario); margin-bottom: 15px;"></i>
                <h3 style="color: var(--texto-secundario); margin-bottom: 20px;">Tu carrito está vacío</h3>
                <a href="tienda.html" class="btn-primario" style="text-decoration: none; display: inline-block;">IR A LA TIENDA</a>
            </div>
        `;
        if (elementoTotal) elementoTotal.textContent = '$0.00';
        return;
    }

    contenedorCarrito.innerHTML = ''; 
    let totalDinero = 0;

    carrito.forEach((item, index) => {
        const precioNumero = parseFloat(String(item.precio).replace('$', ''));
        totalDinero += precioNumero;

        contenedorCarrito.innerHTML += `
            <article class="item-carrito" data-index="${index}">
                <img src="${item.img}" alt="Album">
                <div class="info-carrito">
                    <h3>${item.titulo}</h3>
                    <p>${item.artista}</p>
                </div>
                <p class="precio-carrito">$${item.precio}</p>
                <button class="btn-eliminar"><i class='bx bx-trash' style="font-size: 20px;"></i></button>
            </article>
        `;
    });

    if (elementoTotal) elementoTotal.textContent = '$' + totalDinero.toFixed(2);
}

actualizarPantallaCarrito();

// C) ELIMINAR DEL CARRITO
if (contenedorCarrito) {
    contenedorCarrito.addEventListener('click', (evento) => {
        const botonEliminar = evento.target.closest('.btn-eliminar');
        if (botonEliminar) {
            const articulo = botonEliminar.closest('.item-carrito');
            const indice = articulo.getAttribute('data-index');

            articulo.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            articulo.style.opacity = "0";
            articulo.style.transform = "scale(0.9)";

            setTimeout(() => {
                carrito.splice(indice, 1);
                localStorage.setItem('mc_carrito', JSON.stringify(carrito));
                actualizarPantallaCarrito();
            }, 300);
        }
    });
}
// =========================================================
// D) LÓGICA DEL FORMULARIO DE PAGO (CONECTADO A LA BÓVEDA)
// =========================================================
const btnProcederPago = document.getElementById('btn-proceder');
const contenedorPago = document.getElementById('contenedor-pago');
const formPago = document.getElementById('form-pago');
const inputTarjeta = document.getElementById('num-tarjeta');
const cerrarModal = document.getElementById('cerrar-modal'); 
const modalPago = document.getElementById('modal-pago'); 

// 1. Abrir el formulario o popup de pago
if (btnProcederPago) {
    btnProcederPago.addEventListener('click', () => {
        const usuarioActivo = localStorage.getItem('usuario_mc_activo');
        
        if (!usuarioActivo) {
            alert("🔒 Debes iniciar sesión para procesar la compra.");
            window.location.href = '/assets/pages/login.html';
            return;
        }

        if (typeof carrito === 'undefined' || carrito.length === 0) {
            return mostrarAlertaElegante("⚠️ Tu carrito está vacío. Agrega música primero.");
        }
        
        if (contenedorPago) {
            contenedorPago.style.display = 'block';
            btnProcederPago.style.display = 'none';
        }
        if (modalPago) {
            modalPago.classList.add('modal-activo');
        }
    });
}

// 2. Cerrar el popup (si usas popup)
if (cerrarModal && modalPago) {
    cerrarModal.addEventListener('click', () => {
        modalPago.classList.remove('modal-activo');
    });
}

// 3. Formatear la tarjeta
if (inputTarjeta) {
    inputTarjeta.addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim();
    });
}

// 4. PROCESAR EL PAGO Y ENVIAR A LA BÓVEDA
if (formPago) {
    formPago.addEventListener('submit', (evento) => {
        evento.preventDefault();
        
        const usuarioActivo = localStorage.getItem('usuario_mc_activo');
        const btnSubmit = formPago.querySelector('button');

        // Animación de banco cargando...
        btnSubmit.textContent = 'PROCESANDO CON EL BANCO...';
        btnSubmit.style.opacity = '0.7';
        btnSubmit.style.pointerEvents = 'none';

        setTimeout(() => {
            
            // --- MAGIA: GUARDAR EN LA BÓVEDA ---
            const claveCompras = 'compras_' + usuarioActivo;
            let comprasAnteriores = JSON.parse(localStorage.getItem(claveCompras)) || [];
            
            // Sumamos lo comprado al historial del cliente
            let nuevasCompras = comprasAnteriores.concat(carrito);
            localStorage.setItem(claveCompras, JSON.stringify(nuevasCompras));

            // Vaciamos el carrito del sistema original
            carrito = [];
            localStorage.setItem('mc_carrito', JSON.stringify(carrito));
            if (typeof actualizarPantallaCarrito === 'function') {
                actualizarPantallaCarrito();
            }

            // Ocultar formularios y resetear
            if (modalPago) modalPago.classList.remove('modal-activo');
            if (contenedorPago) contenedorPago.style.display = 'none';
            if (btnProcederPago) btnProcederPago.style.display = 'block';

            formPago.reset();
            btnSubmit.textContent = 'CONFIRMAR PAGO';
            btnSubmit.style.opacity = '1';
            btnSubmit.style.pointerEvents = 'auto';

            // VIAJE FINAL A LA BIBLIOTECA
            alert("✅ ¡Pago exitoso! Tu música ha sido enviada a tu Biblioteca Privada.");
            window.location.href = '/assets/pages/biblioteca.html';

        }, 2500); 
    });
}

// ==========================================
// 5. MOTOR DE LA TIENDA (Dibuja los productos)
// ==========================================
const contenedorTienda = document.querySelector('.grid-albumes');

if (contenedorTienda) {
    async function cargarTienda() {
        try {
            const db = await abrirBaseDeDatos();
            const transaccion = db.transaction([storeName], "readonly");
            const almacen = transaccion.objectStore(storeName);
            const peticion = almacen.getAll(); 

            peticion.onsuccess = () => {
                const canciones = peticion.result;

                if (canciones.length > 0) {
                    contenedorTienda.innerHTML = ''; 
                }

                canciones.forEach(track => {
                    const articulo = document.createElement('article');
                    articulo.classList.add('album');
                    articulo.setAttribute('data-categoria', track.categoria); 
                    
                    // --- CEREBRO DIGITAL: DISCRIMINADOR DE DISEÑO ---
                    let bloqueAudioHTML = '';
                    
                    if (track.categoria === 'ALBUMES' && Array.isArray(track.audio)) {
                        // DISEÑO PREMIUM ESTILO PLAYLIST (SPOTIFY/APPLE MUSIC)
                        bloqueAudioHTML = `
                            <div class="tracklist-contenedor" style="margin-top: 15px; margin-bottom: 15px; text-align: left; background: rgba(9, 3, 15, 0.6); padding: 12px; border-radius: 8px; border: 1px solid var(--borde-tarjeta); max-height: 180px; overflow-y: auto;">
                        `;
                        
                        track.audio.forEach((pista, index) => {
                            bloqueAudioHTML += `
                                <div class="track-row" style="margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                                    <p style="font-size: 12px; color: #ffffff; margin-bottom: 5px; font-weight: 500; font-family: sans-serif;">
                                        <span style="color: var(--color-primario); font-weight: bold;">${index + 1}.</span> ${pista.tituloPista}
                                    </p>
                                    <audio controls controlsList="nodownload" oncontextmenu="return false;" src="${pista.base64}" style="width: 100%; height: 28px;"></audio>
                                </div>
                            `;
                        });
                        
                        bloqueAudioHTML += `</div>`;
                    } else {
                        // DISEÑO TRADICIONAL PARA SINGLES
                        const audioSrc = typeof track.audio === 'string' ? track.audio : (track.audio && track.audio[0] ? track.audio[0].base64 : '');
                        bloqueAudioHTML = `
                            <audio controls controlsList="nodownload" oncontextmenu="return false;" src="${audioSrc}" style="width: 100%; margin-top: 10px; margin-bottom: 10px;"></audio>
                        `;
                    }
                    
                    // Inyectamos la estructura final en la tarjeta
                    articulo.innerHTML = `
                        <img src="${track.img}" alt="Portada de ${track.titulo}">
                        <h4>${track.artista}</h4>
                        <p>${track.titulo} <span style="font-size: 11px; color: var(--color-primario);">[${track.categoria}]</span></p>
                        
                        ${bloqueAudioHTML}
                        
                        <p class="precio">$${track.precio}</p>
                        <button class="btn-comprar">AGREGAR AL CARRITO</button>
                    `;
                    
                    contenedorTienda.appendChild(articulo);

                    const btnComprar = articulo.querySelector('.btn-comprar');
                    btnComprar.addEventListener('click', () => {
                        agregarAlCarrito(track); 
                        
                        const textoOriginal = btnComprar.textContent;
                        btnComprar.textContent = '¡AGREGADO!';
                        btnComprar.style.backgroundColor = 'var(--color-primario)';
                        btnComprar.style.color = 'white';
                        setTimeout(() => {
                            btnComprar.textContent = textoOriginal;
                            btnComprar.style.backgroundColor = 'transparent';
                        }, 2000);
                    });
                });

                // --- TUS FUNCIONES VITALES INTACTAS ---
                if (typeof activarFiltrosTienda === 'function') {
                    activarFiltrosTienda();
                }

                const nuevosAudios = document.querySelectorAll('audio');
                nuevosAudios.forEach(audio => {
                    audio.addEventListener('play', () => {
                        nuevosAudios.forEach(otro => { if (otro !== audio) otro.pause(); });
                    });
                    audio.addEventListener('timeupdate', () => {
                        if (audio.currentTime >= 30) {
                            audio.pause();           
                            audio.currentTime = 0;   
                            mostrarAlertaElegante("¡Preview finalizado! Agrega el track al carrito.");
                        }
                    });
                });
            };
        } catch (error) {
            console.error("Error al cargar la tienda:", error);
        }
    }

    cargarTienda();
}

function activarFiltrosTienda() {
    const botonesFiltro = document.querySelectorAll('.filtros-catalogo button');
    const productosTienda = document.querySelectorAll('.album');

    if (botonesFiltro.length > 0) {
        botonesFiltro.forEach(boton => {
            boton.addEventListener('click', () => {
                botonesFiltro.forEach(b => {
                    b.classList.remove('btn-primario');
                    b.classList.add('btn-secundario');
                });
                boton.classList.remove('btn-secundario');
                boton.classList.add('btn-primario');

                const categoriaBoton = boton.textContent.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

                productosTienda.forEach(producto => {
                    const categoriaProducto = producto.getAttribute('data-categoria').toUpperCase();
                    if (categoriaBoton === 'TODO' || categoriaBoton === categoriaProducto) {
                        producto.style.display = 'block'; 
                    } else {
                        producto.style.display = 'none'; 
                    }
                });
            });
        });
    }
}

// ==========================================
// 6. PANEL DE ADMINISTRADOR (admin.html)
// ==========================================
const formAdmin = document.getElementById('form-admin');
const mensajeAdmin = document.getElementById('mensaje-admin');

if (formAdmin) {
    formAdmin.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        const botonSubmit = formAdmin.querySelector('button');

        const titulo = document.getElementById('titulo-track').value;
        const artista = document.getElementById('artista-track').value;
        const categoria = document.getElementById('categoria-track').value;
        const precio = document.getElementById('precio-track').value;
        
        const archivoImg = document.getElementById('img-track').files[0];
        // AQUÍ EL CAMBIO 1: Agarramos TODOS los archivos, no solo el [0]
        const archivosAudio = document.getElementById('audio-track').files;

        try {
            botonSubmit.textContent = 'PROCESANDO ARCHIVOS...';
            botonSubmit.style.pointerEvents = 'none';
            botonSubmit.style.opacity = '0.7';

            const base64Img = await leerArchivoComoURL(archivoImg);
            
            // AQUÍ EL CAMBIO 2: Creamos el "Empacador" inteligente
            let datosAudio; 

            if (categoria === 'ALBUMES') {
                // Si es un álbum, empacamos todas las canciones en una lista
                datosAudio = [];
                for (let i = 0; i < archivosAudio.length; i++) {
                    const archivo = archivosAudio[i];
                    const base64 = await leerArchivoComoURL(archivo);
                    
                    // Guardamos el nombre de la canción (quitándole el .mp3 del final)
                    const nombrePista = archivo.name.replace(/\.[^/.]+$/, ""); 

                    datosAudio.push({
                        tituloPista: nombrePista,
                        base64: base64
                    });
                }
            } else {
                // Si es single, lo guardamos normal como texto para no dañar los viejos
                datosAudio = await leerArchivoComoURL(archivosAudio[0]);
            }

            const nuevoProducto = {
                id: "track_" + Date.now(),
                titulo: titulo.toUpperCase(),
                artista: artista.toUpperCase(),
                categoria: categoria,
                precio: parseFloat(precio).toFixed(2),
                img: base64Img,
                audio: datosAudio // Ahora esto puede ser 1 canción o una lista entera de 15 canciones
            };

            const db = await abrirBaseDeDatos();
            const transaccion = db.transaction([storeName], "readwrite");
            const almacen = transaccion.objectStore(storeName);
            almacen.add(nuevoProducto);

            transaccion.oncomplete = () => {
                mensajeAdmin.textContent = "¡Track/Álbum subido con éxito a la base de datos!";
                mensajeAdmin.style.color = "#8a2be2";
                mensajeAdmin.style.display = "block";
                formAdmin.reset();

                if(typeof cargarTracksAdmin === 'function') cargarTracksAdmin();
                
                // Reiniciar el botón de subir archivos a su estado normal por seguridad
                const inputAudio = document.getElementById('audio-track');
                inputAudio.removeAttribute('multiple');
                const textoMultiples = document.getElementById('texto-multiples');
                if(textoMultiples) textoMultiples.style.display = 'none';
            };

        } catch (error) {
            console.error(error);
            mensajeAdmin.textContent = "Error al procesar el archivo.";
            mensajeAdmin.style.color = "#ff4d4d";
            mensajeAdmin.style.display = "block";
        } finally {
            botonSubmit.textContent = 'PUBLICAR EN LA TIENDA';
            botonSubmit.style.pointerEvents = 'auto';
            botonSubmit.style.opacity = '1';
            setTimeout(() => { mensajeAdmin.style.display = "none"; }, 4000);
        }
    });
}

// ==========================================
// 7. SISTEMA DE USUARIOS (LOGIN Y REGISTRO)
// ==========================================
const formRegistro = document.getElementById('form-register');
const formLogin = document.getElementById('form-login');
const mensajeErrorUsuario = document.getElementById('mensaje-error');
let usuariosBD = JSON.parse(localStorage.getItem('mc_usuarios')) || [];
// ==========================================
// DETECTOR DE JEFE FANTASMA (Muestra el botón VIP)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const menuJefe = document.getElementById('menu-jefe');
    
    // Si el menú existe en la página y el Jefe está activo
    if (menuJefe && localStorage.getItem('admin_mc_activo') === 'true') {
        // Hacemos aparecer el botón
        menuJefe.style.display = 'block'; 
    }
});

function configurarOjito(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input && icon) {
        icon.addEventListener('click', () => {
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('bx-hide', 'bx-show');
            } else {
                input.type = 'password';
                icon.classList.replace('bx-show', 'bx-hide');
            }
        });
    }
}

configurarOjito('password', 'toggle-password');
configurarOjito('confirmar-password', 'toggle-confirm-password');

if (formRegistro) {
    formRegistro.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const usuario = document.getElementById('usuario').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmar-password').value;
        const btnSubmit = formRegistro.querySelector('button');

        if (password !== confirmPassword) {
            mensajeErrorUsuario.textContent = "Las contraseñas no coinciden.";
            mensajeErrorUsuario.style.display = "block"; return;
        }
        if (password.length < 6) {
            mensajeErrorUsuario.textContent = "La contraseña debe tener al menos 6 caracteres.";
            mensajeErrorUsuario.style.display = "block"; return;
        }
        if (usuariosBD.find(user => user.correo === email)) {
            mensajeErrorUsuario.textContent = "Este correo ya está registrado. Inicia sesión.";
            mensajeErrorUsuario.style.display = "block"; return;
        }

        mensajeErrorUsuario.style.display = "none";
        usuariosBD.push({ nombre: usuario, correo: email, clave: password });
        localStorage.setItem('mc_usuarios', JSON.stringify(usuariosBD));

        btnSubmit.textContent = 'CREANDO CUENTA...';
        btnSubmit.style.opacity = '0.7';
        btnSubmit.style.pointerEvents = 'none';

        setTimeout(() => { window.location.href = "login.html"; }, 1500);
    });
}

if (formLogin) {
    formLogin.addEventListener('submit', (evento) => {
        evento.preventDefault();
        
        // 1. CONECTAMOS CON LOS IDs REALES DE TU HTML
        const inputCorreo = document.getElementById('login-identificador');
        const inputClave = document.getElementById('login-password');
        const btnSubmit = formLogin.querySelector('button');

        // Si por alguna razón no existen en la pantalla, frenamos para no dar error
        if (!inputCorreo || !inputClave) return; 

        // 2. EXTRAEMOS LO QUE ESCRIBIÓ EL USUARIO
        const email = inputCorreo.value.trim().toLowerCase();
        const password = inputClave.value;

        // 🔥 PUERTA SECRETA DEL ADMINISTRADOR 🔥
        // Acepta "admin_mc" o "admin@mc.com"
        if ((email === "admin_mc" || email === "admin@mc.com") && password === "Jefe2026*") {
            localStorage.setItem('admin_mc_activo', 'true');
            alert("👨‍💻 Bienvenido a la cabina de mando, Jefe.");
            
            // Ruta directa porque admin.html y login.html son vecinos en 'pages'
            window.location.href = 'admin.html'; 
            return; 
        }

        // ==========================================
        // TU CÓDIGO NORMAL PARA CLIENTES
        // ==========================================
        const usuarioEncontrado = usuariosBD.find(user => 
            (user.correo || "").toLowerCase() === email || (user.nombre || "").toLowerCase() === email
        );

        if (!usuarioEncontrado || usuarioEncontrado.clave !== password) {
            if (mensajeErrorUsuario) {
                mensajeErrorUsuario.textContent = "Correo o contraseña incorrectos.";
                mensajeErrorUsuario.style.display = "block"; 
            } else {
                alert("Correo o contraseña incorrectos.");
            }
            return;
        }

        if (mensajeErrorUsuario) mensajeErrorUsuario.style.display = "none";
        
        // Guardamos las llaves del cliente
        localStorage.setItem('mc_usuario_activo', JSON.stringify({
            nombre: usuarioEncontrado.nombre, 
            correo: usuarioEncontrado.correo,
            token: "mc_" + Math.random().toString(36).substr(2, 9)
        }));
        localStorage.setItem('usuario_mc_activo', usuarioEncontrado.correo);

        if (btnSubmit) {
            btnSubmit.textContent = 'VERIFICANDO...';
            btnSubmit.style.opacity = '0.7';
            btnSubmit.style.pointerEvents = 'none';
        }

        // Redirige a tienda.html (vecina de login.html)
        setTimeout(() => { window.location.href = "tienda.html"; }, 1500);
    });
}
// ==========================================
// GESTOR DE ADMINISTRADOR: ELIMINAR TRACKS
// ==========================================
const listaAdminTracks = document.getElementById('lista-admin-tracks');

async function cargarTracksAdmin() {
    if (!listaAdminTracks) return; // Si no estamos en la página admin, ignorar

    try {
        const db = await abrirBaseDeDatos();
        const transaccion = db.transaction([storeName], "readonly");
        const almacen = transaccion.objectStore(storeName);
        const peticion = almacen.getAll();

        peticion.onsuccess = () => {
            const canciones = peticion.result;
            listaAdminTracks.innerHTML = ''; // Limpiamos la lista para no duplicar

            if (canciones.length === 0) {
                listaAdminTracks.innerHTML = '<p style="color: gray; font-size: 14px;">No hay música subida en la base de datos todavía.</p>';
                return;
            }

            // Dibujar cada canción en la lista
            canciones.forEach(track => {
                const item = document.createElement('div');
                item.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.05);";
                
                // Saber si es álbum para mostrar cuántas pistas tiene
                const esAlbum = track.categoria === 'ALBUMES' && Array.isArray(track.audio);
                const infoExtra = esAlbum ? `<span style="color: "#8a2be2"; font-size: 11px;">(${track.audio.length} pistas)</span>` : '';

                item.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <img src="${track.img}" style="width: 45px; height: 45px; border-radius: 4px; object-fit: cover; border: 1px solid var(--color-primario);">
                        <div>
                            <p style="margin: 0; font-weight: bold; font-size: 14px; color: white;">${track.titulo} ${infoExtra}</p>
                            <p style="margin: 0; font-size: 12px; color: #a0a0a0;">${track.artista} - $${track.precio}</p>
                        </div>
                    </div>
                    <button class="btn-eliminar-track" data-id="${track.id}" style="background: #ff4d4d; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; transition: 0.3s;">
                        <i class="fas fa-trash"></i> ELIMINAR
                    </button>
                `;

                listaAdminTracks.appendChild(item);
            });

            // Darle el poder de borrar a los botones rojos
            const botonesEliminar = document.querySelectorAll('.btn-eliminar-track');
            botonesEliminar.forEach(boton => {
                boton.addEventListener('click', async (e) => {
                    const idEliminar = e.target.closest('.btn-eliminar-track').getAttribute('data-id');
                    
                    // Pregunta de seguridad antes de borrar
                    if(confirm('🚨 ¿Estás seguro de que deseas eliminar este track o álbum? Se borrará de la tienda inmediatamente.')) {
                        await eliminarTrackDeDB(idEliminar);
                    }
                });
            });
        };
    } catch (error) {
        console.error("Error al cargar el gestor:", error);
    }
}

async function eliminarTrackDeDB(id) {
    try {
        const db = await abrirBaseDeDatos();
        const transaccion = db.transaction([storeName], "readwrite");
        const almacen = transaccion.objectStore(storeName);
        
        const peticion = almacen.delete(id);
        
        peticion.onsuccess = () => {
            cargarTracksAdmin(); // Recargar la lista visual al instante
            alert("✅ Eliminado correctamente de la base de datos.");
        };
    } catch (error) {
        console.error("Error al intentar eliminar:", error);
    }
}

// Ejecutar automáticamente cuando cargue la página
document.addEventListener('DOMContentLoaded', cargarTracksAdmin);

// --- LÓGICA DEL MENÚ DESPLEGABLE DEL GESTOR ---
document.addEventListener('DOMContentLoaded', () => {
    const cabeceraGestor = document.getElementById('cabecera-gestor');
    const listaAdminTracksContenedor = document.getElementById('lista-admin-tracks');
    const iconoDesplegable = document.getElementById('icono-desplegable');

    if (cabeceraGestor && listaAdminTracksContenedor && iconoDesplegable) {
        cabeceraGestor.addEventListener('click', () => {
            // Si está oculto, lo mostramos y giramos la flecha
            if (listaAdminTracksContenedor.style.display === 'none') {
                listaAdminTracksContenedor.style.display = 'block';
                iconoDesplegable.style.transform = 'rotate(180deg)';
            } else {
                // Si está visible, lo ocultamos y volvemos la flecha a su lugar
                listaAdminTracksContenedor.style.display = 'none';
                iconoDesplegable.style.transform = 'rotate(0deg)';
            }
        });
    }
});

// ==========================================
// BÓVEDA PRIVADA CONECTADA A INDEXEDDB (VERSIÓN DEFINITIVA Y SEGURA)
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    const contenedorBiblioteca = document.getElementById('grid-biblioteca');
    
    if (contenedorBiblioteca) {
        const usuarioActivo = localStorage.getItem('usuario_mc_activo');
        
        if (!usuarioActivo) {
            window.location.href = '/assets/pages/login.html'; 
            return;
        }
        
        const claveCompras = 'compras_' + usuarioActivo;
        const compras = JSON.parse(localStorage.getItem(claveCompras)) || [];
        
        if (compras.length > 0) {
            contenedorBiblioteca.innerHTML = '<p style="text-align:center; color: "#8a2be2"; width: 100%;">Cargando música desde los servidores seguros...</p>';
            
            try {
                const db = await abrirBaseDeDatos();
                contenedorBiblioteca.innerHTML = ''; 
                
                compras.forEach(trackComprado => {
                    const transaccion = db.transaction(["catalogo_musica"], "readonly");
                    const store = transaccion.objectStore("catalogo_musica");
                    const peticion = store.get(trackComprado.id);
                    
                    peticion.onsuccess = () => {
                        const cancionOriginal = peticion.result;
                        const datos = cancionOriginal || trackComprado; 
                        
                        const articulo = document.createElement('article');
                        articulo.classList.add('album');
                        articulo.style.border = "1px solid #8a2be2"; 
                        
                        let bloqueAudioHTML = '';
                        
                        // 🔥 LA SOLUCIÓN ESTÁ AQUÍ: Extraemos el audio de forma segura
                        let archivoMusical = datos.audio || datos.base64 || trackComprado.audio || '';
                        
                        // 1. SI ES UN ÁLBUM (Comprobamos estrictamente si es una LISTA / Array)
                        if (Array.isArray(archivoMusical)) {
                            bloqueAudioHTML = `<div style="margin-top: 15px; max-height: 180px; overflow-y: auto; background: rgba(9, 3, 15, 0.6); padding: 10px; border-radius: 8px;">`;
                            
                            archivoMusical.forEach((pista, index) => {
                                let urlAudio = typeof pista === 'string' ? pista : (pista.base64 || pista.audio);
                                let nombrePista = pista.tituloPista || `Pista ${index + 1}`;
                                bloqueAudioHTML += `
                                    <div style="margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                                        <p style="font-size: 12px; color: white; margin-bottom: 5px;"><b>${index + 1}.</b> ${nombrePista}</p>
                                        <audio controls src="${urlAudio}" style="width: 100%; height: 30px;"></audio>
                                        <a href="${urlAudio}" download="${datos.artista || 'Artista'} - ${nombrePista}.mp3" style="display: block; text-align: center; background: #8a2be2; color: black; padding: 5px; border-radius: 4px; font-size: 11px; margin-top: 5px; text-decoration: none; font-weight: bold;">
                                            <i class='bx bx-download'></i> DESCARGAR
                                        </a>
                                    </div>`;
                            });
                            bloqueAudioHTML += `</div>`;
                        } 
                        // 2. SI ES UN SINGLE (Es un solo archivo de texto/base64)
                        else {
                            bloqueAudioHTML = `
                                <audio controls src="${archivoMusical}" style="width: 100%; margin-top: 10px; margin-bottom: 10px;"></audio>
                                <a href="${archivoMusical}" download="${datos.artista || 'Artista'} - ${datos.titulo || 'Audio'}.mp3" style="display: block; text-align: center; background: #8a2be2; color: black; padding: 8px; border-radius: 4px; font-size: 12px; text-decoration: none; font-weight: bold;">
                                    <i class='bx bx-download'></i> DESCARGAR ARCHIVO
                                </a>
                            `;
                        }
                        
                        articulo.innerHTML = `
                            <img src="${datos.img || trackComprado.img || '/assets/img/logo.png'}" alt="Portada">
                            <h4>${datos.artista || trackComprado.artista || 'Artista Desconocido'}</h4>
                            <p>${datos.titulo || trackComprado.titulo || 'Sin título'}</p>
                            <span style="display: inline-block; background: rgba(37, 211, 102, 0.2); color: #8a2be2; padding: 3px 8px; border-radius: 10px; font-size: 10px; font-weight: bold; margin-bottom: 10px;">TRACK ADQUIRIDO</span>
                            ${bloqueAudioHTML}
                        `;
                        contenedorBiblioteca.appendChild(articulo);
                    };
                });
                
            } catch (error) {
                console.error("Error al acceder a IndexedDB:", error);
                contenedorBiblioteca.innerHTML = '<p style="color: red; text-align: center;">Error al cargar los servidores seguros.</p>';
            }
            
        } else {
            contenedorBiblioteca.innerHTML = '<p style="text-align:center; width: 100%; color: white; margin-top: 20px;">Tu bóveda está vacía. ¡Ve a la tienda a buscar nueva música!</p>';
        }
    }
});

// PROCESAR PAGO Y TRANSFERIR A BÓVEDA 
// ==========================================
function procesarPagoCarrito(evento) {
    // 1. Freno de mano: Evita que el formulario recargue la página
    if (evento) {
        evento.preventDefault(); 
    }

    const usuarioActivo = localStorage.getItem('usuario_mc_activo');
    
    // 2. Verificamos que esté logueado
    if (!usuarioActivo) {
        alert("🔒 Debes iniciar sesión para procesar la compra.");
        window.location.href = '/assets/pages/login.html';
        return;
    }

    // 3. Rescatamos el carrito directamente de la memoria dura del navegador
    let carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Si la memoria dura está vacía, intentamos con la variable de la página
    if (carritoGuardado.length === 0) {
        if (typeof carrito !== 'undefined' && carrito.length > 0) {
            carritoGuardado = carrito;
        } else {
            alert("⚠️ Tu carrito de compras parece estar vacío. Ve a la tienda y agrega música.");
            return;
        }
    }

    // 4. Traemos el casillero de compras de este usuario específico
    const claveCompras = 'compras_' + usuarioActivo;
    let comprasAnteriores = JSON.parse(localStorage.getItem(claveCompras)) || [];
    
    // 5. Sumamos la música vieja con la música nueva
    let nuevasCompras = comprasAnteriores.concat(carritoGuardado);
    
    // 6. ¡GUARDAMOS CON CANDADO EN LA BASE DE DATOS LOCAL!
    localStorage.setItem(claveCompras, JSON.stringify(nuevasCompras));

    // 7. Vaciamos el carrito porque ya se cobró todo
    localStorage.setItem('carrito', '[]'); 
    if (typeof carrito !== 'undefined') {
        carrito = [];
    }
    if (typeof actualizarCarritoUI === 'function') {
        actualizarCarritoUI();
    }
    
    // 8. Celebramos y viajamos a la Bóveda
    alert("✅ ¡Pago exitoso! Tu música ha sido enviada a tu Biblioteca Privada.");
    window.location.href = '/assets/pages/biblioteca.html';
}

// ==========================================
// SISTEMA DE LOGIN ÚNICO Y DEFINITIVO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    const mensajeErrorUsuario = document.getElementById('mensaje-error-login');

    if (formLogin) {
        formLogin.addEventListener('submit', (evento) => {
            evento.preventDefault();
            
            const inputCorreo = document.getElementById('login-identificador');
            const inputClave = document.getElementById('login-password');
            const btnSubmit = formLogin.querySelector('button');

            if (!inputCorreo || !inputClave) return; 

            // Convertimos lo que escribió el usuario en la variable 'email'
            const email = inputCorreo.value.trim().toLowerCase();
            const password = inputClave.value;

            // 🔥 1. LA PUERTA DEL JEFE (ADMINISTRADOR) 🔥
            if ((email === "admin_mc" || email === "admin@mc.com") && password === "Jefe2026*") {
                localStorage.setItem('admin_mc_activo', 'true');
                
                if (btnSubmit) {
                    btnSubmit.textContent = 'ABRIENDO CABINA...';
                    btnSubmit.style.backgroundColor = '#8a2be2';
                    btnSubmit.style.pointerEvents = 'none';
                }
                
                // Va directo a su panel (Son vecinos en pages)
                setTimeout(() => { window.location.href = '/assets/pages/admin.html'; }, 1000);
                return; // ¡Frena todo para que no se mezcle con el cliente!
            }

            // ==========================================
            // 2. LA PUERTA DE LOS CLIENTES NORMALES
            // ==========================================
            // Busca en ambas posibles bases de datos por si acaso
            let usuariosBD = JSON.parse(localStorage.getItem('mc_usuarios')) || JSON.parse(localStorage.getItem('usuarios_mc_db')) || [];
            
            const usuarioEncontrado = usuariosBD.find(user => 
                (user.correo || "").toLowerCase() === email || (user.nombre || "").toLowerCase() === email
            );

            // Verifica si existe y si la clave coincide (soporta 'clave' o 'password')
            if (!usuarioEncontrado || (usuarioEncontrado.clave !== password && usuarioEncontrado.password !== password)) {
                if (mensajeErrorUsuario) {
                    mensajeErrorUsuario.textContent = "❌ Correo o contraseña incorrectos.";
                    mensajeErrorUsuario.style.display = "block"; 
                } else {
                    alert("❌ Correo o contraseña incorrectos.");
                }
                return;
            }

            if (mensajeErrorUsuario) mensajeErrorUsuario.style.display = "none";
            
            // Guardamos las credenciales del cliente
            localStorage.setItem('mc_usuario_activo', JSON.stringify({
                nombre: usuarioEncontrado.nombre, 
                correo: usuarioEncontrado.correo,
                token: "mc_" + Math.random().toString(36).substr(2, 9)
            }));
            localStorage.setItem('usuario_mc_activo', usuarioEncontrado.correo);

            if (btnSubmit) {
                btnSubmit.textContent = 'VERIFICANDO...';
                btnSubmit.style.opacity = '0.7';
                btnSubmit.style.pointerEvents = 'none';
            }

            // Va directo a la tienda (Son vecinos en pages)
            setTimeout(() => { window.location.href = "tienda.html"; }, 1500);
        });
    }
});

// ==========================================
// SISTEMA DE REGISTRO PARA CLIENTES REALES
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. LÓGICA DE MOSTRAR/OCULTAR CONTRASEÑAS (Los ojitos)
    const togglePassword = document.getElementById('toggle-password');
    const inputPassword = document.getElementById('password');
    const toggleConfirm = document.getElementById('toggle-confirm-password');
    const inputConfirm = document.getElementById('confirmar-password');

    function configurarOjito(icono, input) {
        if(icono && input) {
            icono.addEventListener('click', () => {
                if (input.type === 'password') {
                    input.type = 'text';
                    icono.classList.replace('bx-hide', 'bx-show'); // Cambia el icono
                    icono.style.color = '#8a2be2'; // Se pinta del color de tu diseño
                } else {
                    input.type = 'password';
                    icono.classList.replace('bx-show', 'bx-hide');
                    icono.style.color = 'gray';
                }
            });
        }
    }

    configurarOjito(togglePassword, inputPassword);
    configurarOjito(toggleConfirm, inputConfirm);


    // 2. LÓGICA DE CREACIÓN DE CUENTA
    const formRegister = document.getElementById('form-register');
    const mensajeError = document.getElementById('mensaje-error');

    // Función interna para mostrar errores en tu texto rojo del HTML
    function mostrarError(mensaje) {
        if (mensajeError) {
            mensajeError.textContent = mensaje;
            mensajeError.style.display = 'block';
            // Desaparece el error después de 4 segundos para que se vea limpio
            setTimeout(() => { mensajeError.style.display = 'none'; }, 4000);
        } else {
            alert(mensaje);
        }
    }

    if (formRegister) {
        formRegister.addEventListener('submit', (e) => {
            e.preventDefault(); // Freno para que la página no parpadee

            const nombre = document.getElementById('usuario').value.trim();
            const correo = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            const confirmar = document.getElementById('confirmar-password').value;

            // Filtros de Seguridad
            if (password.length < 6) {
                return mostrarError("⚠️ La contraseña debe tener al menos 6 caracteres.");
            }
            if (password !== confirmar) {
                return mostrarError("⚠️ Las contraseñas no coinciden. Revisa de nuevo.");
            }

            // Abrimos la base de datos de usuarios
            let usuarios = JSON.parse(localStorage.getItem('usuarios_mc_db')) || [];

            // Revisamos si el cliente ya existe
            const existe = usuarios.find(user => user.correo === correo);
            if (existe) {
                return mostrarError("⚠️ Este correo ya está registrado. Por favor, inicia sesión.");
            }

            // Creamos el perfil del cliente
            const nuevoUsuario = {
                nombre: nombre,
                correo: correo,
                password: password, 
                fechaRegistro: new Date().toLocaleDateString()
            };

            // Guardamos al cliente en el disco duro del navegador
            usuarios.push(nuevoUsuario);
            localStorage.setItem('usuarios_mc_db', JSON.stringify(usuarios));

            // ¡Magia! Le damos la sesión automáticamente para que no tenga que loguearse de nuevo
            localStorage.setItem('usuario_mc_activo', correo);

            // Alerta de éxito y viaje directo a la tienda
            alert(`✅ ¡Bienvenido a la familia MC Productions, ${nombre}! Tu cuenta está lista.`);
            window.location.href = '/index.html'; 
        });
    }
});

// ==========================================
// SISTEMA DE INICIO DE SESIÓN (LOGIN INTELIGENTE)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    const mensajeErrorLogin = document.getElementById('mensaje-error-login');

    function mostrarErrorLogin(mensaje) {
        if (mensajeErrorLogin) {
            mensajeErrorLogin.textContent = mensaje;
            mensajeErrorLogin.style.display = 'block';
            setTimeout(() => { mensajeErrorLogin.style.display = 'none'; }, 4000);
        } else {
            alert(mensaje);
        }
    }

    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault(); 

            // Capturamos lo que el usuario escribió
            const inputIdentificador = document.getElementById('login-identificador').value.trim().toLowerCase();
            const password = document.getElementById('login-password').value;

            // 🔥 LA PUERTA SECRETA DEL ADMINISTRADOR 🔥
            // Si el nombre es "admin_mc" y la contraseña es tu clave secreta:
            if (inputIdentificador === "admin_mc" && password === "Jefe2026*") {
                // Te damos la Llave Maestra
                localStorage.setItem('admin_mc_activo', 'true');
                alert("👨‍💻 Bienvenido a la cabina de mando, Jefe.");
                
                // Pon aquí la ruta correcta de tu archivo de administrador
                window.location.href = '/admin.html'; 
                return; // Frenamos el código aquí para que no siga buscando como cliente
            }

            // ==================================================
            // Si NO es el admin, sigue el código normal para clientes:
            // ==================================================
            let usuarios = JSON.parse(localStorage.getItem('usuarios_mc_db')) || [];

            const usuarioEncontrado = usuarios.find(user => 
                (user.correo.toLowerCase() === inputIdentificador || user.nombre.toLowerCase() === inputIdentificador) 
                && user.password === password
            );

            if (!usuarioEncontrado) {
                return mostrarErrorLogin("❌ Usuario, correo o contraseña incorrectos.");
            }

           // Pase VIP para cliente normal
            localStorage.setItem('usuario_mc_activo', usuarioEncontrado.correo);
            alert(`✅ ¡Qué bueno verte de nuevo, ${usuarioEncontrado.nombre}!`);
            
            // 👇 ESTA ES LA LÍNEA QUE CAMBIAS 👇
            window.location.href = 'tienda.html'; 
        });
    }
});

// ==========================================
// CEREBRO DEL PERFIL DE USUARIO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Verificamos si estamos en la página de perfil (buscando un elemento específico)
    const perfilNombre = document.getElementById('perfil-nombre');
    
    if (perfilNombre) {
        const usuarioActivo = localStorage.getItem('usuario_mc_activo');
        
        // Si nadie inició sesión, lo mandamos al login
        if (!usuarioActivo) {
            window.location.href = '/assets/pages/login.html';
            return;
        }

        // 1. Extraemos los datos del usuario de la base de datos
        let usuarios = JSON.parse(localStorage.getItem('usuarios_mc_db')) || [];
        const misDatos = usuarios.find(user => user.correo === usuarioActivo);

        // 2. Extraemos cuántas canciones ha comprado
        const claveCompras = 'compras_' + usuarioActivo;
        const misCompras = JSON.parse(localStorage.getItem(claveCompras)) || [];

        // 3. Imprimimos los datos en la pantalla
        if (misDatos) {
            document.getElementById('perfil-nombre').textContent = misDatos.nombre;
            document.getElementById('perfil-correo').textContent = misDatos.correo;
            document.getElementById('perfil-fecha').textContent = misDatos.fechaRegistro || 'Reciente';
            document.getElementById('perfil-tracks').textContent = `${misCompras.length} Tracks`;
        }

        // 4. LÓGICA DE CERRAR SESIÓN
        const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
        if (btnCerrarSesion) {
            btnCerrarSesion.addEventListener('click', () => {
                const confirmar = confirm("¿Estás seguro de que quieres cerrar sesión?");
                if (confirmar) {
                    // Borramos la "Llave VIP"
                    localStorage.removeItem('usuario_mc_activo');
                    // Lo mandamos al inicio
                    window.location.href = '/index.html';
                }
            });
        }
    }
});

// ==========================================
// ==========================================
// CONTROLADOR GLOBAL DEL MENÚ (DINÁMICO)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificamos si hay alguien con sesión iniciada
    const usuarioActivo = localStorage.getItem('usuario_mc_activo');
    
    // 2. Buscamos el botón del menú (ya sea que diga login o profile)
    const enlaceLogin = document.querySelector('a[href*="login.html"], a[href*="profile.html"]');

    if (enlaceLogin) {
        if (usuarioActivo) {
            // ✅ SI EL CLIENTE ESTÁ ADENTRO
            enlaceLogin.href = '/assets/pages/profile.html';
            enlaceLogin.innerHTML = "<i class='bx bxs-user-circle'></i> MI PERFIL";
            enlaceLogin.style.color = "#8a2be2"; 
            enlaceLogin.style.fontWeight = "bold";
        } else {
            // ❌ SI NO HAY NADIE ADENTRO (O CERRÓ SESIÓN)
            enlaceLogin.href = '/assets/pages/login.html';
            enlaceLogin.innerHTML = "LOGIN"; // Vuelve a decir LOGIN
            enlaceLogin.style.color = ""; // Vuelve al color normal del menú
            enlaceLogin.style.fontWeight = "normal";
        }
    }
});

// ==========================================
// SISTEMA DE CAMBIO DE CONTRASEÑA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const btnAbrirPass = document.getElementById('btn-abrir-password');
    const modalPass = document.getElementById('modal-password');
    const btnCerrarModalPass = document.getElementById('btn-cerrar-modal-pass');
    const btnGuardarPass = document.getElementById('btn-guardar-password');

    // 1. Abrir y Cerrar la ventanita
    if (btnAbrirPass && modalPass && btnCerrarModalPass) {
        btnAbrirPass.addEventListener('click', () => {
            modalPass.style.display = 'flex';
        });

        btnCerrarModalPass.addEventListener('click', () => {
            modalPass.style.display = 'none';
            // Limpiar las casillas si cancela
            document.getElementById('pass-actual').value = '';
            document.getElementById('pass-nueva').value = '';
            document.getElementById('pass-confirmar').value = '';
        });
    }

    // 2. Procesar el cambio de seguridad
    if (btnGuardarPass) {
        btnGuardarPass.addEventListener('click', () => {
            const passActualInput = document.getElementById('pass-actual').value;
            const passNueva = document.getElementById('pass-nueva').value;
            const passConfirmar = document.getElementById('pass-confirmar').value;

            const usuarioActivo = localStorage.getItem('usuario_mc_activo');
            let usuarios = JSON.parse(localStorage.getItem('usuarios_mc_db')) || [];
            
            // Buscamos cuál es el usuario que está conectado
            let indiceUsuario = usuarios.findIndex(user => user.correo === usuarioActivo);

            if (indiceUsuario !== -1) {
                // Verificamos si escribió bien su contraseña actual
                if (usuarios[indiceUsuario].password !== passActualInput) {
                    alert("❌ La contraseña actual es incorrecta.");
                    return;
                }
                
                // Filtros de seguridad para la nueva contraseña
                if (passNueva.length < 6) {
                    alert("⚠️ La nueva contraseña debe tener al menos 6 caracteres.");
                    return;
                }
                
                if (passNueva !== passConfirmar) {
                    alert("⚠️ Las contraseñas nuevas no coinciden.");
                    return;
                }

                // Si pasa todas las pruebas, ¡HACEMOS EL CAMBIO!
                usuarios[indiceUsuario].password = passNueva;
                localStorage.setItem('usuarios_mc_db', JSON.stringify(usuarios));

                alert("✅ ¡Contraseña actualizada con éxito!");
                
                // Cerramos y limpiamos todo
                modalPass.style.display = 'none';
                document.getElementById('pass-actual').value = '';
                document.getElementById('pass-nueva').value = '';
                document.getElementById('pass-confirmar').value = '';
            }
        });
    }
});

// ==========================================
// SISTEMA DE FOTO DE PERFIL (AVATAR)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const inputAvatar = document.getElementById('input-avatar');
    const perfilImg = document.getElementById('perfil-img');

    // 1. CARGAR LA FOTO AL ENTRAR AL PERFIL
    if (perfilImg) {
        const usuarioActivo = localStorage.getItem('usuario_mc_activo');
        let usuarios = JSON.parse(localStorage.getItem('usuarios_mc_db')) || [];
        const misDatos = usuarios.find(user => user.correo === usuarioActivo);

        // Si el cliente ya tenía una foto guardada, la ponemos en pantalla
        if (misDatos && misDatos.avatar) {
            perfilImg.src = misDatos.avatar;
        }
    }

    // 2. CAMBIAR LA FOTO CUANDO TOCA LA CÁMARA
    if (inputAvatar && perfilImg) {
        inputAvatar.addEventListener('change', function(event) {
            const archivo = event.target.files[0]; // Capturamos la foto
            
            if (archivo) {
                // Filtro de peso (Opcional, pero recomendado: Máximo 2MB)
                if (archivo.size > 2 * 1024 * 1024) {
                    alert("⚠️ La imagen es muy pesada. Elige una de menos de 2MB.");
                    return;
                }

                const lector = new FileReader();
                
                // Cuando termine de leer la imagen...
                lector.onload = function(e) {
                    const fotoBase64 = e.target.result; // La foto convertida en texto
                    
                    // A. Cambiamos la foto en la pantalla al instante
                    perfilImg.src = fotoBase64;

                    // B. La guardamos en su bóveda secreta de datos
                    const usuarioActivo = localStorage.getItem('usuario_mc_activo');
                    let usuarios = JSON.parse(localStorage.getItem('usuarios_mc_db')) || [];
                    let indiceUsuario = usuarios.findIndex(user => user.correo === usuarioActivo);
                    
                    if (indiceUsuario !== -1) {
                        usuarios[indiceUsuario].avatar = fotoBase64;
                        localStorage.setItem('usuarios_mc_db', JSON.stringify(usuarios));
                        
                        // Pequeño aviso visual (se borra en 2 seg)
                        const nombreOriginal = document.getElementById('perfil-nombre').textContent;
                        document.getElementById('perfil-nombre').textContent = "¡Foto Actualizada! ✅";
                        setTimeout(() => { document.getElementById('perfil-nombre').textContent = nombreOriginal; }, 2000);
                    }
                };
                
                // Inicia la conversión
                lector.readAsDataURL(archivo);
            }
        });
    }
});