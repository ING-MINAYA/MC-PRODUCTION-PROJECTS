// ==========================================
// 1. MENÚ MÓVIL (Hamburguesa) MEJORADO
// ==========================================
const iconoMenu = document.getElementById('icono-menu');
const menu = document.getElementById('menu');
const enlacesMenu = document.querySelectorAll('#menu li a'); 

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
        precio: producto.precio,
        img: producto.img 
    };

    carrito.push(productoLigero);
    
    try {
        localStorage.setItem('mc_carrito', JSON.stringify(carrito));
        mostrarAlertaElegante(`✅ ¡${producto.titulo} agregado al carrito!`);
    } catch (error) {
        console.error(error);
        mostrarAlertaElegante("⚠️ Error: La foto de portada es demasiado pesada para el carrito.");
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
                    
                    articulo.innerHTML = `
                        <img src="${track.img}" alt="Portada de ${track.titulo}">
                        <h4>${track.artista}</h4>
                        <p>${track.titulo} <span style="font-size: 11px; color: var(--color-primario);">[${track.categoria}]</span></p>
                        <audio src="${track.audio}" controls></audio>
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

                activarFiltrosTienda();

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
        const archivoAudio = document.getElementById('audio-track').files[0];

        try {
            botonSubmit.textContent = 'PROCESANDO ARCHIVOS...';
            botonSubmit.style.pointerEvents = 'none';
            botonSubmit.style.opacity = '0.7';

            const base64Img = await leerArchivoComoURL(archivoImg);
            const base64Audio = await leerArchivoComoURL(archivoAudio);

            const nuevoProducto = {
                id: "track_" + Date.now(),
                titulo: titulo.toUpperCase(),
                artista: artista.toUpperCase(),
                categoria: categoria,
                precio: parseFloat(precio).toFixed(2),
                img: base64Img,
                audio: base64Audio 
            };

            const db = await abrirBaseDeDatos();
            const transaccion = db.transaction([storeName], "readwrite");
            const almacen = transaccion.objectStore(storeName);
            almacen.add(nuevoProducto);

            transaccion.oncomplete = () => {
                mensajeAdmin.textContent = "¡Track subido con éxito a la base de datos!";
                mensajeAdmin.style.color = "#25D366";
                mensajeAdmin.style.display = "block";
                formAdmin.reset();
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
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btnSubmit = formLogin.querySelector('button');

        const usuarioEncontrado = usuariosBD.find(user => user.correo === email);

        if (!usuarioEncontrado || usuarioEncontrado.clave !== password) {
            mensajeErrorUsuario.textContent = "Correo o contraseña incorrectos.";
            mensajeErrorUsuario.style.display = "block"; return;
        }

        mensajeErrorUsuario.style.display = "none";
        localStorage.setItem('mc_usuario_activo', JSON.stringify({
            nombre: usuarioEncontrado.nombre, correo: email,
            token: "mc_" + Math.random().toString(36).substr(2, 9)
        }));

        btnSubmit.textContent = 'VERIFICANDO...';
        btnSubmit.style.opacity = '0.7';
        btnSubmit.style.pointerEvents = 'none';

        setTimeout(() => { window.location.href = "tienda.html"; }, 1500);
    });
}