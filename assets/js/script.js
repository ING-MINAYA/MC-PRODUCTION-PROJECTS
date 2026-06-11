
// ==========================================
// 🚀 CONEXIÓN A FIREBASE (BASE DE DATOS EN LA NUBE)
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-storage.js";

// ... (Aquí dejas la configuración "firebaseConfig" exactamente igual a como la tienes) ...
const firebaseConfig = {
    apiKey: "AIzaSyCe18DBeoTAo4VLcaDltvBG2WJdtljIRVQ",
    authDomain: "mc-productions-bbb58.firebaseapp.com",
    projectId: "mc-productions-bbb58",
    storageBucket: "mc-productions-bbb58.firebasestorage.app",
    messagingSenderId: "397778540670",
    appId: "1:397778540670:web:e463876e5133347542602f"
};

// Inicializamos los superpoderes
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

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

    // 🚀 Creamos una copia ligera para el carrito
    const productoLigero = {
        id: producto.id,
        titulo: producto.titulo,
        artista: producto.artista,
        precio: parseFloat(producto.precio), 
        categoria: producto.categoria,
        img: producto.img // 🔥 ¡AÑADIMOS LA IMAGEN DE VUELTA! Ahora es un link súper ligero
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

        // Por si alguna canción vieja no tiene categoría, evitamos que salga en blanco
        const etiquetaCategoria = item.categoria ? item.categoria : 'SINGLE';

        contenedorCarrito.innerHTML += `
            <article class="item-carrito" data-index="${index}">
                <img src="${item.img || ''}" alt="Portada" style="width: 55px; height: 55px; object-fit: cover; border-radius: 5px; border: 1px solid rgba(138, 43, 226, 0.3);">
                <div class="info-carrito">
                    <h3>${item.titulo}</h3>
                    <p style="display: flex; align-items: center; gap: 8px;">
                        ${item.artista} 
                        <span style="font-size: 9px; background: rgba(138, 43, 226, 0.2); padding: 3px 6px; border-radius: 4px; border: 1px solid #8a2be2; color: white; font-weight: bold; letter-spacing: 1px;">
                            ${etiquetaCategoria}
                        </span>
                    </p>
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
// 🛒 5. MOTOR DE LA TIENDA - FIREBASE CLOUD
// ==========================================
const contenedorTienda = document.querySelector('.grid-albumes');

if (contenedorTienda) {
    async function cargarTienda() {
        try {
            contenedorTienda.innerHTML = '<p style="color: #8a2be2; text-align: center; width: 100%; grid-column: 1 / -1;">⏳ Conectando con los servidores de MC Productions...</p>';
            
            // --- CONEXIÓN DIRECTA A LA NUBE ---
            const querySnapshot = await getDocs(collection(db, "catalogo_musica"));
            contenedorTienda.innerHTML = ''; 

            if (querySnapshot.empty) {
                contenedorTienda.innerHTML = '<p style="color: gray; text-align: center; width: 100%; grid-column: 1 / -1;">El catálogo está vacío por el momento.</p>';
                return;
            }

            // --- LEER Y DIBUJAR CADA CANCIÓN ---
            querySnapshot.forEach(documento => {
                const track = documento.data();
                track.id = documento.id; // Le pegamos el ID de Firebase para el carrito

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
                                <audio controls controlsList="nodownload" oncontextmenu="return false;" src="${pista.url}" style="width: 100%; height: 28px;"></audio>
                            </div>
                        `;
                    });
                    
                    bloqueAudioHTML += `</div>`;
                } else {
                    // DISEÑO TRADICIONAL PARA SINGLES
                    // Ahora track.audio es un link directo de Firebase (String)
                    const audioSrc = track.audio; 
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

                // --- LÓGICA DEL BOTÓN COMPRAR ---
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

            // Sistema Anti-Piratería y Anti-Superposición
            const nuevosAudios = document.querySelectorAll('audio');
            nuevosAudios.forEach(audio => {
                audio.addEventListener('play', () => {
                    // Pausa los demás
                    nuevosAudios.forEach(otro => { if (otro !== audio) otro.pause(); });
                });
                audio.addEventListener('timeupdate', () => {
                    // Limita a 30 segundos
                    if (audio.currentTime >= 30) {
                        audio.pause();           
                        audio.currentTime = 0;   
                        if (typeof mostrarAlertaElegante === 'function') {
                            mostrarAlertaElegante("¡Preview finalizado! Agrega el track al carrito.");
                        } else {
                            alert("¡Preview finalizado! Agrega el track al carrito.");
                        }
                    }
                });
            });

        } catch (error) {
            console.error("Error al cargar la tienda desde Firebase:", error);
            contenedorTienda.innerHTML = '<p style="color: red; text-align: center; width: 100%; grid-column: 1 / -1;">❌ Error de conexión. No se pudo cargar el catálogo.</p>';
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
// 🚀 6. PANEL DE ADMINISTRADOR (admin.html) - MOTOR FIREBASE
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
        const archivosAudio = document.getElementById('audio-track').files;

        if (!archivoImg || archivosAudio.length === 0) {
            if (mensajeAdmin) {
                mensajeAdmin.textContent = "❌ Debes seleccionar la portada y el archivo de audio.";
                mensajeAdmin.style.color = "#ff4d4d";
                mensajeAdmin.style.display = "block";
            }
            return;
        }

        try {
            // Animación de carga Premium
            botonSubmit.textContent = '🚀 SUBIENDO A SERVIDORES...';
            botonSubmit.style.pointerEvents = 'none';
            botonSubmit.style.opacity = '0.7';
            
            if (mensajeAdmin) {
                mensajeAdmin.textContent = "⏳ Subiendo archivos a la nube, por favor espera...";
                mensajeAdmin.style.color = "#8a2be2";
                mensajeAdmin.style.display = "block";
            }

            // --- FASE A: SUBIR PORTADA A FIREBASE STORAGE ---
            const nombreUnicoImg = `${Date.now()}_${archivoImg.name}`;
            const referenciaImg = ref(storage, `portadas/${nombreUnicoImg}`);
            await uploadBytes(referenciaImg, archivoImg);
            const urlImagenOficial = await getDownloadURL(referenciaImg);
            
            // --- FASE B: SUBIR AUDIO(S) A FIREBASE STORAGE ---
            let datosAudio; 

            if (categoria === 'ALBUMES') {
                // Si es un álbum, subimos todas las canciones y guardamos sus links en una lista
                datosAudio = [];
                for (let i = 0; i < archivosAudio.length; i++) {
                    const archivo = archivosAudio[i];
                    const nombreUnicoAudio = `${Date.now()}_${archivo.name}`;
                    const referenciaAudio = ref(storage, `canciones/${nombreUnicoAudio}`);
                    
                    // Subir archivo individual
                    await uploadBytes(referenciaAudio, archivo);
                    const urlAudioOficial = await getDownloadURL(referenciaAudio);

                    // Limpiar el nombre (quitar .mp3)
                    const nombrePista = archivo.name.replace(/\.[^/.]+$/, ""); 

                    datosAudio.push({
                        tituloPista: nombrePista.toUpperCase(),
                        url: urlAudioOficial
                    });
                }
            } else {
                // Si es single, subimos solo la primera canción
                const archivoUnico = archivosAudio[0];
                const nombreUnicoAudio = `${Date.now()}_${archivoUnico.name}`;
                const referenciaAudio = ref(storage, `canciones/${nombreUnicoAudio}`);
                
                await uploadBytes(referenciaAudio, archivoUnico);
                datosAudio = await getDownloadURL(referenciaAudio);
            }

            // --- FASE C: GUARDAR PRODUCTO EN FIRESTORE (NUBE) ---
            const nuevoProducto = {
                titulo: titulo.toUpperCase(),
                artista: artista.toUpperCase(),
                categoria: categoria,
                precio: parseFloat(precio).toFixed(2),
                img: urlImagenOficial,
                audio: datosAudio, // Puede ser el link directo (string) o la lista de canciones (array)
                fechaPublicacion: serverTimestamp() // Fecha del servidor de Google
            };

            // Guardamos en la colección oficial de tu catálogo
            await addDoc(collection(db, "catalogo_musica"), nuevoProducto);

            // Éxito absoluto
            if (mensajeAdmin) {
                mensajeAdmin.textContent = "✅ ¡Track/Álbum publicado con éxito en la nube de Firebase!";
                mensajeAdmin.style.color = "#28a745";
                mensajeAdmin.style.display = "block";
            }
            
            formAdmin.reset();

            // Llamar al actualizador visual de la lista si existe
            if (typeof cargarTracksAdmin === 'function') cargarTracksAdmin();
            
            // Apagar la opción múltiple del input por seguridad
            const inputAudio = document.getElementById('audio-track');
            if (inputAudio) inputAudio.removeAttribute('multiple');
            
            const textoMultiples = document.getElementById('texto-multiples');
            if (textoMultiples) textoMultiples.style.display = 'none';

        } catch (error) {
            console.error("Error al subir a Firebase:", error);
            if (mensajeAdmin) {
                mensajeAdmin.textContent = "❌ Error al procesar o subir los archivos.";
                mensajeAdmin.style.color = "#ff4d4d";
                mensajeAdmin.style.display = "block";
            }
        } finally {
            botonSubmit.textContent = 'PUBLICAR EN LA TIENDA';
            botonSubmit.style.pointerEvents = 'auto';
            botonSubmit.style.opacity = '1';
            setTimeout(() => { 
                if (mensajeAdmin) mensajeAdmin.style.display = "none"; 
            }, 5000);
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
configurarOjito('login-password', 'toggle-login-password');

// ==========================================
// SISTEMA DE REGISTRO CON FIREBASE
// ==========================================
if (formRegistro) {
    formRegistro.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        
        const usuario = document.getElementById('usuario').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmar-password').value;
        const btnSubmit = formRegistro.querySelector('button');

        if (password !== confirmPassword) {
            mensajeErrorUsuario.textContent = "Las contraseñas no coinciden.";
            mensajeErrorUsuario.style.display = "block"; 
            return;
        }
        if (password.length < 6) {
            mensajeErrorUsuario.textContent = "La contraseña debe tener al menos 6 caracteres.";
            mensajeErrorUsuario.style.display = "block"; 
            return;
        }

        btnSubmit.textContent = 'CREANDO CUENTA EN LA NUBE...';
        btnSubmit.style.opacity = '0.7';
        btnSubmit.style.pointerEvents = 'none';
        mensajeErrorUsuario.style.display = "none";

        try {
            // 1. Creamos el usuario en Firebase Authentication
            const credencial = await createUserWithEmailAndPassword(auth, email, password);
            const usuarioFirebase = credencial.user;

            // 2. Guardamos sus datos en Firestore Database
            await setDoc(doc(db, "usuarios", usuarioFirebase.uid), {
                nombre: usuario,
                correo: email,
                rol: "cliente",
                fechaRegistro: new Date().toISOString()
            });

            alert("✅ ¡Cuenta creada con éxito! Ahora inicia sesión.");
            window.location.href = "login.html";

        } catch (error) {
            btnSubmit.textContent = 'REGISTRARSE';
            btnSubmit.style.opacity = '1';
            btnSubmit.style.pointerEvents = 'auto';

            if (error.code === 'auth/email-already-in-use') {
                mensajeErrorUsuario.textContent = "Este correo ya está registrado. Ve al Login.";
            } else {
                mensajeErrorUsuario.textContent = "Error al crear la cuenta: " + error.message;
            }
            mensajeErrorUsuario.style.display = "block";
        }
    });
}

// ==========================================
// SISTEMA DE INICIO DE SESIÓN CON FIREBASE
// ==========================================
const mensajeErrorLogin = document.getElementById('mensaje-error-login');

if (formLogin) {
    // IMPORTANTE: Si ves otro "formLogin.addEventListener" más arriba o más abajo, ¡BÓRRALO! Solo debe existir este:
    formLogin.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const inputCorreo = document.getElementById('login-identificador');
        const inputClave = document.getElementById('login-password');
        const btnSubmit = formLogin.querySelector('button');

        if (!inputCorreo || !inputClave) return;

        const email = inputCorreo.value.trim().toLowerCase();
        const password = inputClave.value;

        // 🧹 APAGAMOS CUALQUIER ERROR VIEJO AL INSTANTE
        if (mensajeErrorLogin) {
            mensajeErrorLogin.style.display = "none";
            mensajeErrorLogin.textContent = "";
        }

        btnSubmit.textContent = 'VERIFICANDO CREDENCIALES...';
        btnSubmit.style.opacity = '0.7';
        btnSubmit.style.pointerEvents = 'none';

        // 👨‍💻 PUERTA SECRETA DEL JEFE (LOCAL)
        if ((email === "admin_mc" || email === "admin@mc.com") && password === "Jefe2026*") {
            localStorage.setItem('admin_mc_activo', 'true');
            localStorage.setItem('mc_tiempo_sesion', Date.now()); // 🔥 AQUÍ ENTRA EL CRONÓMETRO
            btnSubmit.style.backgroundColor = "#8a2be2";
            btnSubmit.style.opacity = '1';
            btnSubmit.textContent = "👨‍💻 ABRIENDO CABINA...";
            setTimeout(() => { window.location.href = 'admin.html'; }, 1000);
            return;
        }

        // 🔐 ACCESO PARA CLIENTES EN LA NUBE (FIREBASE)
        try {
            const credencial = await signInWithEmailAndPassword(auth, email, password);
            const usuarioFirebase = credencial.user;

            const docRef = doc(db, "usuarios", usuarioFirebase.uid);
            const docSnap = await getDoc(docRef);

            let nombreUsuario = "Cliente";
            if (docSnap.exists()) {
                nombreUsuario = docSnap.data().nombre;
            }

            // 🎟️ LE DAMOS LOS DOS PASES VIP PARA QUE LA TIENDA NO SE VUELVA LOCA
            localStorage.setItem('usuario_mc_activo', usuarioFirebase.email);
            localStorage.setItem('mc_tiempo_sesion', Date.now()); // 🔥 AQUÍ ENTRA EL CRONÓMETRO PARA EL CLIENTE
            localStorage.setItem('mc_usuario_activo', JSON.stringify({
                nombre: nombreUsuario, 
                correo: usuarioFirebase.email,
                token: "firebase_" + usuarioFirebase.uid // Token moderno
            }));
            
            // Animación Premium
            btnSubmit.style.backgroundColor = "#28a745"; 
            btnSubmit.style.opacity = '1';
            btnSubmit.textContent = `✅ ¡BIENVENIDO, ${nombreUsuario.toUpperCase()}!`;
            
            setTimeout(() => { window.location.href = "tienda.html"; }, 1200);

        } catch (error) {
            btnSubmit.textContent = 'ENTRAR';
            btnSubmit.style.opacity = '1';
            btnSubmit.style.pointerEvents = 'auto';

            if (mensajeErrorLogin) {
                if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    mensajeErrorLogin.textContent = "❌ El correo o la contraseña son incorrectos.";
                } else {
                    mensajeErrorLogin.textContent = "❌ Error al conectar: " + error.message;
                }
                mensajeErrorLogin.style.display = "block";
            }
        }
    });
}
// ==========================================
// 👁️ VISOR Y GESTOR DE CATÁLOGO (ADMIN) EN FIREBASE
// ==========================================
const listaAdminTracks = document.getElementById('lista-admin-tracks');
const cabeceraGestor = document.getElementById('cabecera-gestor');
const iconoDesplegable = document.getElementById('icono-desplegable');

// Función maestra para leer la nube y pintar la lista
async function cargarTracksAdmin() {
    if (!listaAdminTracks) return;

    listaAdminTracks.innerHTML = '<p style="color: #8a2be2; text-align: center; font-weight: bold;">⏳ Conectando con la bóveda de Google...</p>';

    try {
        // Traemos toda la colección de música de una vez
        const querySnapshot = await getDocs(collection(db, "catalogo_musica"));
        listaAdminTracks.innerHTML = ''; // Limpiamos el mensaje de carga

        if (querySnapshot.empty) {
            listaAdminTracks.innerHTML = '<p style="color: #ff4d4d; text-align: center;">No hay música en la nube todavía.</p>';
            return;
        }

        // Leemos cada documento de la base de datos
        querySnapshot.forEach((documento) => {
            const track = documento.data();
            const trackId = documento.id; // El ID encriptado de Google

            // Creamos la tarjeta visual de la canción
            const div = document.createElement('div');
            div.style.cssText = "background: rgba(0,0,0,0.4); margin-bottom: 10px; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.1);";

            div.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <img src="${track.img}" style="width: 50px; height: 50px; border-radius: 5px; object-fit: cover; border: 1px solid #8a2be2;">
                        <h4 style="color: white; margin: 0; font-size: 16px;">${track.titulo}</h4>
                        <p style="color: #aaa; margin: 5px 0 0 0; font-size: 12px; font-weight: bold;">
                            ${track.artista} | <span style="color: #28a745;">$${track.precio}</span> | ${track.categoria}
                        </p>
                    </div>
                </div>
                <button class="btn-eliminar-admin" data-id="${trackId}" style="background: #ff4d4d; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.3s;">🗑️ ELIMINAR</button>
            `;
            listaAdminTracks.appendChild(div);
        });

        // 🎯 Darle vida a los botones rojos de eliminar
        document.querySelectorAll('.btn-eliminar-admin').forEach(boton => {
            boton.addEventListener('click', async (e) => {
                const idBorrar = e.target.getAttribute('data-id');
                if(confirm("⚠️ ¿Estás seguro de que quieres borrar esta obra maestra de la tienda pública?")) {
                    e.target.textContent = "Borrando...";
                    e.target.style.opacity = "0.5";
                    
                    // Dispara la orden de eliminación a la nube
                    await deleteDoc(doc(db, "catalogo_musica", idBorrar));
                    
                    // Recarga la lista automáticamente
                    cargarTracksAdmin(); 
                }
            });
        });

    } catch (error) {
        console.error("Error al cargar la bóveda:", error);
        listaAdminTracks.innerHTML = '<p style="color: red; text-align: center;">❌ Error al leer los datos de Firebase.</p>';
    }
}

// 🎛️ Control del botón desplegable
if (cabeceraGestor) {
    cabeceraGestor.addEventListener('click', () => {
        if (listaAdminTracks.style.display === 'none' || listaAdminTracks.style.display === '') {
            listaAdminTracks.style.display = 'block';
            if (iconoDesplegable) iconoDesplegable.style.transform = 'rotate(180deg)';
            cargarTracksAdmin(); // Solo gasta datos de Google cuando lo abres
        } else {
            listaAdminTracks.style.display = 'none';
            if (iconoDesplegable) iconoDesplegable.style.transform = 'rotate(0deg)';
        }
    });
}

// Hacemos la función global para que el formulario la llame automáticamente tras subir un track
window.cargarTracksAdmin = cargarTracksAdmin;

// ==========================================
// 🎧 BÓVEDA PRIVADA CONECTADA A FIREBASE (MI BIBLIOTECA)
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
            contenedorBiblioteca.innerHTML = '<p style="text-align:center; color: #8a2be2; width: 100%; grid-column: 1 / -1;">⏳ Desencriptando música desde los servidores de Google...</p>';
            
            try {
                contenedorBiblioteca.innerHTML = ''; 
                
                // Iteramos sobre las compras guardadas en el historial del cliente
                for (const trackComprado of compras) {
                    
                    // 🚀 MAGIA: Usamos el ID de la compra para buscar el archivo original, fresco y directo en la nube
                    const docRef = doc(db, "catalogo_musica", trackComprado.id);
                    const docSnap = await getDoc(docRef);
                    
                    if (docSnap.exists()) {
                        const datosOriginales = docSnap.data();
                        
                        const articulo = document.createElement('article');
                        articulo.classList.add('album');
                        articulo.style.border = "1px solid #8a2be2"; 
                        
                        let bloqueAudioHTML = '';
                        
                        // 1. SI ES UN ÁLBUM
                        if (datosOriginales.categoria === 'ALBUMES' && Array.isArray(datosOriginales.audio)) {
                            bloqueAudioHTML = `<div style="margin-top: 15px; max-height: 180px; overflow-y: auto; background: rgba(9, 3, 15, 0.6); padding: 10px; border-radius: 8px;">`;
                            
                            datosOriginales.audio.forEach((pista, index) => {
                                bloqueAudioHTML += `
                                    <div style="margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                                        <p style="font-size: 12px; color: white; margin-bottom: 5px;"><b>${index + 1}.</b> ${pista.tituloPista}</p>
                                        <audio controls controlsList="nodownload" src="${pista.url}" style="width: 100%; height: 30px;"></audio>
                                        <a href="${pista.url}" target="_blank" style="display: block; text-align: center; background: #8a2be2; color: white; padding: 5px; border-radius: 4px; font-size: 11px; margin-top: 5px; text-decoration: none; font-weight: bold;">
                                            <i class='bx bx-cloud-download'></i> ABRIR / DESCARGAR
                                        </a>
                                    </div>`;
                            });
                            bloqueAudioHTML += `</div>`;
                        } 
                        // 2. SI ES UN SINGLE
                        else {
                            bloqueAudioHTML = `
                                <audio controls controlsList="nodownload" src="${datosOriginales.audio}" style="width: 100%; margin-top: 10px; margin-bottom: 10px;"></audio>
                                <a href="${datosOriginales.audio}" target="_blank" style="display: block; text-align: center; background: #8a2be2; color: white; padding: 8px; border-radius: 4px; font-size: 12px; text-decoration: none; font-weight: bold;">
                                    <i class='bx bx-cloud-download'></i> ABRIR / DESCARGAR ARCHIVO
                                </a>
                            `;
                        }
                        
                        articulo.innerHTML = `
                            <img src="${datosOriginales.img}" alt="Portada">
                            <h4>${datosOriginales.artista}</h4>
                            <p>${datosOriginales.titulo}</p>
                            <span style="display: inline-block; background: rgba(37, 211, 102, 0.2); color: #8a2be2; padding: 3px 8px; border-radius: 10px; font-size: 10px; font-weight: bold; margin-bottom: 10px;">TRACK ADQUIRIDO</span>
                            ${bloqueAudioHTML}
                        `;
                        contenedorBiblioteca.appendChild(articulo);
                    }
                }
                
            } catch (error) {
                console.error("Error al acceder a Firebase Database:", error);
                contenedorBiblioteca.innerHTML = '<p style="color: red; text-align: center; width: 100%; grid-column: 1 / -1;">❌ Error al cargar los servidores seguros.</p>';
            }
            
        } else {
            contenedorBiblioteca.innerHTML = '<p style="text-align:center; width: 100%; grid-column: 1 / -1; color: white; margin-top: 20px;">Tu bóveda está vacía. ¡Ve a la tienda a buscar nueva música!</p>';
        }
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
// 👤 CEREBRO DEL PERFIL DE USUARIO Y AVATAR (FIREBASE)
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    
    const perfilNombre = document.getElementById('perfil-nombre');
    const perfilImg = document.getElementById('perfil-img');
    const inputAvatar = document.getElementById('input-avatar');
    
    if (perfilNombre) {
        const usuarioActivo = localStorage.getItem('usuario_mc_activo');
        const datosLocales = JSON.parse(localStorage.getItem('mc_usuario_activo'));
        
        // Si nadie inició sesión, lo mandamos al login
        if (!usuarioActivo) {
            window.location.href = '/assets/pages/login.html';
            return;
        }

        // --- 1. CARGAR CANTIDAD DE TRACKS COMPRADOS ---
        const claveCompras = 'compras_' + usuarioActivo;
        const misCompras = JSON.parse(localStorage.getItem(claveCompras)) || [];
        const elementoTracks = document.getElementById('perfil-tracks');
        if (elementoTracks) {
            elementoTracks.textContent = `${misCompras.length} Tracks`;
        }

        // --- 2. CARGAR FOTO DE PERFIL (AVATAR) ---
        const claveAvatar = 'avatar_' + usuarioActivo;
        const avatarGuardado = localStorage.getItem(claveAvatar);
        if (avatarGuardado && perfilImg) {
            perfilImg.src = avatarGuardado;
        }

        // ==========================================
        // --- 3. CONECTAR CON FIREBASE PARA DATOS REALES (PARCHE TURBO) ---
        try {
        // 🚀 ACCIÓN INMEDIATA: Pintamos el nombre y correo usando la memoria local de la sesión activa
            if (datosLocales && datosLocales.nombre) {
                perfilNombre.textContent = datosLocales.nombre;
            } else if (usuarioActivo === "admin@mc.com" || usuarioActivo === "admin_mc") {
                perfilNombre.textContent = "EL JEFE (ADMIN)";
            } else {
                perfilNombre.textContent = "Cliente VIP";
            }

            const elementoCorreo = document.getElementById('perfil-correo');
            if(elementoCorreo) elementoCorreo.textContent = usuarioActivo;

            // ☁️ BÚSQUEDA EN SEGUNDO PLANO: Vamos a la nube de Google solo por la fecha de registro
            if (datosLocales && datosLocales.token && datosLocales.token.includes('firebase_')) {
                const uid = datosLocales.token.replace('firebase_', '');
                const docRef = doc(db, "usuarios", uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const datosNube = docSnap.data();
                    
                    // Si encontramos la fecha en Firebase, la pintamos de inmediato
                    if (datosNube.fechaRegistro) {
                        const fecha = new Date(datosNube.fechaRegistro);
                        const elementoFecha = document.getElementById('perfil-fecha');
                        if (elementoFecha) elementoFecha.textContent = fecha.toLocaleDateString();
                    }
                }
            } else if (usuarioActivo === "admin@mc.com" || usuarioActivo === "admin_mc") {
                const elementoFecha = document.getElementById('perfil-fecha');
                if (elementoFecha) elementoFecha.textContent = "Día 1";
            }

        } catch (error) {
            console.error("Error cargando perfil desde la nube:", error);
            // Si el internet o la nube fallan, el nombre ya se pintó arriba de forma segura 🚀
        }

        // --- 4. LÓGICA DE CERRAR SESIÓN SEGURA ---
        const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
        if (btnCerrarSesion) {
            btnCerrarSesion.addEventListener('click', () => {
                const confirmar = confirm("¿Estás seguro de que quieres cerrar sesión?");
                if (confirmar) {
                    // Borramos TODAS las llaves de seguridad al salir
                    localStorage.removeItem('usuario_mc_activo');
                    localStorage.removeItem('mc_usuario_activo');
                    localStorage.removeItem('mc_tiempo_sesion');
                    localStorage.removeItem('admin_mc_activo');
                    window.location.href = '/index.html';
                }
            });
        }

        // --- 5. LÓGICA PARA CAMBIAR LA FOTO DE PERFIL ---
        if (inputAvatar && perfilImg) {
            inputAvatar.addEventListener('change', function(event) {
                const archivo = event.target.files[0]; 
                
                if (archivo) {
                    if (archivo.size > 2 * 1024 * 1024) {
                        alert("⚠️ La imagen es muy pesada. Elige una de menos de 2MB.");
                        return;
                    }

                    const lector = new FileReader();
                    lector.onload = function(e) {
                        const fotoBase64 = e.target.result; 
                        
                        perfilImg.src = fotoBase64;
                        localStorage.setItem(claveAvatar, fotoBase64); // Guardamos su foto única
                        
                        const nombreOriginal = perfilNombre.textContent;
                        perfilNombre.textContent = "¡Foto Actualizada! ✅";
                        setTimeout(() => { perfilNombre.textContent = nombreOriginal; }, 2000);
                    };
                    lector.readAsDataURL(archivo);
                }
            });
        }
    }
});

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
// ⏱️ GUARDIÁN DE TIEMPO DE SESIÓN (EXPIRACIÓN DE 12 HORAS)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const usuarioActivo = localStorage.getItem('usuario_mc_activo');
    const adminActivo = localStorage.getItem('admin_mc_activo');
    const tiempoSesion = localStorage.getItem('mc_tiempo_sesion');

    // Si hay alguien logueado y tenemos la hora guardada
    if ((usuarioActivo || adminActivo) && tiempoSesion) {
        const tiempoActual = Date.now();
        const tiempoPasado = tiempoActual - parseInt(tiempoSesion);

        // ⏱️ Configuración del límite: 12 horas (puedes cambiar el 12 por 24 si quieres un día entero)
        const limiteHoras = 1;
        const limiteMilisegundos = limiteHoras * 60 * 60 * 1000;

        // Si el tiempo pasado es mayor al límite permitido...
        if (tiempoPasado > limiteMilisegundos) {
            // 🧹 Borramos todas las llaves y pases VIP
            localStorage.removeItem('usuario_mc_activo');
            localStorage.removeItem('mc_usuario_activo');
            localStorage.removeItem('mc_tiempo_sesion');
            localStorage.removeItem('admin_mc_activo'); 

            // Avisamos y lo mandamos al login
            alert("⏳ Tu sesión ha expirado por seguridad. Por favor, vuelve a iniciar sesión.");
            window.location.href = '/assets/pages/login.html';
        }
    }
});