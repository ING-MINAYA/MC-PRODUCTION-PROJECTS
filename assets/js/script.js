
// ==========================================
// 🚀 CONEXIÓN A FIREBASE (BASE DE DATOS EN LA NUBE)
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updatePassword, EmailAuthProvider, reauthenticateWithCredential, signOut, sendEmailVerification } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";
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
// 💳 MOTOR DE PAGOS REAL (PAYPAL)
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const contenedorBotonesPayPal = document.getElementById('paypal-button-container');

    // Solo activamos PayPal si estamos en la página del carrito
    if (contenedorBotonesPayPal) {
        
        window.paypal.Buttons({
            // A) CONFIGURAR EL COBRO
            createOrder: function(data, actions) {
                // 1. Extraemos el total exacto que aparece en pantalla (tu carrito)
                const textoTotal = document.querySelector('.total-precio').textContent;
                // Le quitamos el símbolo de dólar para que PayPal solo lea el número
                const totalNumerico = textoTotal.replace('$', '').trim(); 

                // Si el total es 0, no cobramos
                if (parseFloat(totalNumerico) <= 0) {
                    alert("Tu carrito está vacío. Agrega música primero.");
                    return;
                }

                // Le enviamos la orden a PayPal con el monto exacto
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: totalNumerico
                        },
                        description: "Música Premium - MC Productions"
                    }]
                });
            },
            
            // B) SI EL BANCO APRUEBA EL PAGO (OPTIMIZADO PARA MÓVILES)
            onApprove: function(data, actions) {
                return actions.order.capture().then(async function(detalles) {
                    
                    try {
                        const usuarioActivo = localStorage.getItem('usuario_mc_activo');
                        
                        if (!usuarioActivo) {
                            alert("⚠️ Alerta: No se detectó sesión activa. Guarda tu ID: " + detalles.id);
                            return;
                        }

                        // 1. Extraemos las canciones que están en el carrito local
                        let carritoActual = JSON.parse(localStorage.getItem('mc_carrito')) || [];
                        
                        // 2. Preparamos los datos estructurados para la nube
                        const nuevasAdquisiciones = carritoActual.map(item => ({
                            id: item.id,
                            titulo: item.titulo || "Track Premium",
                            fechaCompra: new Date().toISOString(),
                            transaccionId: detalles.id, 
                            montoPagado: detalles.purchase_units[0].amount.value
                        }));

                        // 3. TRAER HISTORIAL VIEJO DE FIREBASE
                        const docRefCompras = doc(db, "historial_compras", usuarioActivo);
                        const docSnap = await getDoc(docRefCompras);
                        
                        let historialCompleto = nuevasAdquisiciones;
                        
                        if (docSnap.exists()) {
                            const datosViejos = docSnap.data();
                            if (datosViejos.compras && Array.isArray(datosViejos.compras)) {
                                historialCompleto = datosViejos.compras.concat(nuevasAdquisiciones);
                            }
                        }

                        // 💥 EMPIEZA LA OPTIMIZACIÓN VISUAL PARA EL CELULAR 💥
                        // Avisamos de inmediato en pantalla ANTES de que el navegador se congele
                        const nombreCliente = detalles.payer.name.given_name || "Jefe";
                        alert(`✅ ¡Pago exitoso, ${nombreCliente}! Estamos guardando tu música en tu Bóveda...`);

                        // 4. SUBIDA EN VIVO A LA NUBE DE GOOGLE FIREBASE
                        await setDoc(docRefCompras, { 
                            usuario: usuarioActivo,
                            compras: historialCompleto,
                            ultimaActualizacion: new Date().toISOString()
                        }, { merge: true });

                        // 5. RESPALDO LOCAL DE SEGURIDAD
                        const claveCompras = 'compras_' + usuarioActivo;
                        localStorage.setItem(claveCompras, JSON.stringify(historialCompleto));

                        // 6. VACIAR EL CARRITO COMPLETAMENTE
                        localStorage.setItem('mc_carrito', JSON.stringify([]));
                        
                        // 7. VIAJE TRIUNFAL INMEDIATO (FORZANDO AL NAVEGADOR PRINCIPAL) 🚀
                        // window.top obliga al celular a cerrar el iframe de PayPal y mover la página entera
                        window.top.location.href = '/assets/pages/biblioteca.html';

                    } catch (error) {
                        console.error("Error crítico guardando la compra en Firebase:", error);
                        // También forzamos la salida aquí en caso de un micro-corte de internet
                        window.top.location.href = '/assets/pages/biblioteca.html';
                    }
                });
            },
            
            // C) SI LA TARJETA ES FALSA O EL USUARIO CANCELA
            onError: function(err) {
                console.error("Error procesando pago:", err);
                alert("❌ Ocurrió un error con la transacción o fue cancelada.");
            }

        }).render('#paypal-button-container');
    }
});

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
                mensajeAdmin.style.color = "#8a2be2";
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

            // 🚀 NUEVO: Le disparamos el correo oficial de verificación
            await sendEmailVerification(usuarioFirebase);

            // 2. Guardamos sus datos en Firestore Database
            await setDoc(doc(db, "usuarios", usuarioFirebase.uid), {
                nombre: usuario,
                correo: email,
                rol: "cliente",
                fechaRegistro: new Date().toISOString()
            });

            // 🚀 NUEVO: Lo cerramos de inmediato para que no entre sin verificar
            await signOut(auth);

            alert("✉️ ¡Cuenta creada! Te enviamos un enlace a tu correo. Por favor revísalo (y tu carpeta de SPAM) para verificar tu cuenta antes de iniciar sesión.");
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
    formLogin.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const inputCorreo = document.getElementById('login-identificador');
        const inputClave = document.getElementById('login-password');
        const btnSubmit = formLogin.querySelector('button');

        if (!inputCorreo || !inputClave) return;

        const email = inputCorreo.value.trim().toLowerCase();
        const password = inputClave.value;

        if (mensajeErrorLogin) {
            mensajeErrorLogin.style.display = "none";
            mensajeErrorLogin.textContent = "";
        }

        btnSubmit.textContent = 'VERIFICANDO CREDENCIALES...';
        btnSubmit.style.opacity = '0.7';
        btnSubmit.style.pointerEvents = 'none';

        // 🔐 ACCESO OFICIAL EN LA NUBE (FIREBASE)
        try {
            const credencial = await signInWithEmailAndPassword(auth, email, password);
            const usuarioFirebase = credencial.user;

            // 🛑 EL MURO: SI NO ESTÁ VERIFICADO Y NO ES EL JEFE, LO RECHAZAMOS
            if (!usuarioFirebase.emailVerified && usuarioFirebase.email !== "mcproductions407@gmail.com") {
                await signOut(auth); // Lo desconectamos por tramposo
                
                btnSubmit.textContent = 'ENTRAR';
                btnSubmit.style.opacity = '1';
                btnSubmit.style.pointerEvents = 'auto';
                
                if (mensajeErrorLogin) {
                    mensajeErrorLogin.textContent = "❌ Debes verificar tu correo electrónico para entrar. Revisa tu bandeja de entrada o SPAM.";
                    mensajeErrorLogin.style.display = "block";
                }
                return; // Detenemos la función aquí
            }

            // 👑 BIFURCACIÓN DE PODER: ¿ES EL JEFE O ES UN CLIENTE?
            if (usuarioFirebase.email === "mcproductions407@gmail.com") {
                
                // 👨‍💻 ACCESO TOTAL DE ADMINISTRADOR
                localStorage.setItem('admin_mc_activo', 'true');
                localStorage.setItem('usuario_mc_activo', usuarioFirebase.email); 
                localStorage.setItem('mc_tiempo_sesion', Date.now());
                
                btnSubmit.style.backgroundColor = "#8a2be2";
                btnSubmit.style.opacity = '1';
                btnSubmit.textContent = "👨‍💻 ABRIENDO CABINA DEL JEFE...";
                setTimeout(() => { window.location.href = 'admin.html'; }, 1000);
                return;

            } else {
                
                // 🎧 ACCESO DE CLIENTE VIP NORMAL
                const docRef = doc(db, "usuarios", usuarioFirebase.uid);
                const docSnap = await getDoc(docRef);

                let nombreUsuario = "Cliente";
                if (docSnap.exists()) {
                    nombreUsuario = docSnap.data().nombre;
                }

                localStorage.setItem('usuario_mc_activo', usuarioFirebase.email);
                localStorage.setItem('mc_tiempo_sesion', Date.now()); 
                localStorage.setItem('mc_usuario_activo', JSON.stringify({
                    nombre: nombreUsuario, 
                    correo: usuarioFirebase.email,
                    token: "firebase_" + usuarioFirebase.uid
                }));
                
                btnSubmit.style.backgroundColor = "#8a2be2"; 
                btnSubmit.style.opacity = '1';
                btnSubmit.textContent = `✅ ¡BIENVENIDO, ${nombreUsuario.toUpperCase()}!`;
                
                setTimeout(() => { window.location.href = "tienda.html"; }, 1200);
            }

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
                            ${track.artista} | <span style="color: #8a2be2;">$${track.precio}</span> | ${track.categoria}
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
        
        contenedorBiblioteca.innerHTML = '<p style="text-align:center; color: #8a2be2; width: 100%; grid-column: 1 / -1;">⏳ Conectando con tu Bóveda en la Nube...</p>';
        
        try {
            // 🚀 MAGIA: Vamos directo a Firestore a buscar el documento con el correo del usuario
            const docRefCompras = doc(db, "historial_compras", usuarioActivo);
            const docSnap = await getDoc(docRefCompras);
            
            if (docSnap.exists()) {
                const datosHistorial = docSnap.data();
                const compras = datosHistorial.compras || [];
                
                if (compras.length > 0) {
                    contenedorBiblioteca.innerHTML = ''; 
                    
                    // Iteramos sobre las compras bajadas de la nube
                    for (const trackComprado of compras) {
                        
                        // Buscamos el archivo original del catálogo
                        const docRef = doc(db, "catalogo_musica", trackComprado.id);
                        const docTrackSnap = await getDoc(docRef);
                        
                        if (docTrackSnap.exists()) {
                            const datosOriginales = docTrackSnap.data();
                            
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
                } else {
                    contenedorBiblioteca.innerHTML = '<p style="text-align:center; width: 100%; grid-column: 1 / -1; color: white; margin-top: 20px;">Tu bóveda está vacía. ¡Ve a la tienda a buscar nueva música!</p>';
                }
            } else {
                 contenedorBiblioteca.innerHTML = '<p style="text-align:center; width: 100%; grid-column: 1 / -1; color: white; margin-top: 20px;">Aún no tienes historial de compras. ¡Ve a la tienda!</p>';
            }
            
        } catch (error) {
            console.error("Error al acceder al historial en Firebase Database:", error);
            contenedorBiblioteca.innerHTML = '<p style="color: red; text-align: center; width: 100%; grid-column: 1 / -1;">❌ Error al conectar con tu Bóveda en la Nube.</p>';
        }
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

        // --- 1. CARGA RÁPIDA LOCAL (Mientras carga la nube) ---
        const claveAvatar = 'avatar_' + usuarioActivo;
        const avatarGuardado = localStorage.getItem(claveAvatar);
        if (avatarGuardado && perfilImg) {
            perfilImg.src = avatarGuardado;
        }
        
        if (datosLocales && datosLocales.nombre) {
            perfilNombre.textContent = datosLocales.nombre;
        } else if (usuarioActivo === "mcproductions407@gmail.com" || usuarioActivo === "admin_mc") {
            perfilNombre.textContent = "EL JEFE (ADMIN)";
        } else {
            perfilNombre.textContent = "Cliente VIP";
        }

        const elementoCorreo = document.getElementById('perfil-correo');
        if(elementoCorreo) elementoCorreo.textContent = usuarioActivo;

        // ==========================================
        // --- 2. CONECTAR CON FIREBASE PARA DATOS REALES ---
        try {
            // A) Buscar datos del usuario (Avatar y Fecha)
            if (datosLocales && datosLocales.token && datosLocales.token.includes('firebase_')) {
                const uid = datosLocales.token.replace('firebase_', '');
                const docRefUsuario = doc(db, "usuarios", uid);
                const docSnapUsuario = await getDoc(docRefUsuario);

                if (docSnapUsuario.exists()) {
                    const datosNube = docSnapUsuario.data();
                    
                    // Pintamos la fecha
                    if (datosNube.fechaRegistro) {
                        const fecha = new Date(datosNube.fechaRegistro);
                        const elementoFecha = document.getElementById('perfil-fecha');
                        if (elementoFecha) elementoFecha.textContent = fecha.toLocaleDateString();
                    }

                    // Pintamos el avatar
                    if (datosNube.avatar) {
                        perfilImg.src = datosNube.avatar;
                        localStorage.setItem(claveAvatar, datosNube.avatar); 
                    }
                }
            } else if (usuarioActivo === "mcproductions407@gmail.com" || usuarioActivo === "admin_mc") {
                const elementoFecha = document.getElementById('perfil-fecha');
                if (elementoFecha) elementoFecha.textContent = "Día 1";
            }

            // B) 🚀 MAGIA: Buscar cantidad real de compras en la nube para el contador
            const elementoTracks = document.getElementById('perfil-tracks');
            if (elementoTracks) {
                const docRefCompras = doc(db, "historial_compras", usuarioActivo);
                const docSnapCompras = await getDoc(docRefCompras);
                
                if (docSnapCompras.exists()) {
                    const datosHistorial = docSnapCompras.data();
                    // Contamos los elementos dentro de la lista 'compras'
                    const totalCompras = datosHistorial.compras ? datosHistorial.compras.length : 0;
                    elementoTracks.textContent = `${totalCompras} Tracks`;
                } else {
                    elementoTracks.textContent = `0 Tracks`;
                }
            }

        } catch (error) {
            console.error("Error cargando perfil desde la nube:", error);
            // Si hay un micro-corte de internet, usamos el respaldo local para que no quede en blanco
            const elementoTracks = document.getElementById('perfil-tracks');
            if (elementoTracks) {
                const misCompras = JSON.parse(localStorage.getItem('compras_' + usuarioActivo)) || [];
                elementoTracks.textContent = `${misCompras.length} Tracks`;
            }
        }

        // --- 4. LÓGICA PARA CAMBIAR LA FOTO DE PERFIL (SUBIDA A FIREBASE) ---
        if (inputAvatar && perfilImg) {
            inputAvatar.addEventListener('change', async function(event) {
                const archivo = event.target.files[0]; 
                
                if (archivo) {
                    if (archivo.size > 2 * 1024 * 1024) {
                        alert("⚠️ La imagen es muy pesada. Elige una de menos de 2MB.");
                        return;
                    }

                    // 🛑 ESCUDO: Asegurarnos de que Firebase ya despertó
                    if (!auth.currentUser) {
                        alert("⏳ Conectando con seguridad de Google... Por favor, intenta subirla de nuevo en 2 segundos.");
                        return;
                    }

                    const nombreOriginal = perfilNombre.textContent;
                    perfilNombre.textContent = "⏳ Subiendo a la nube...";

                    try {
                        // 🧹 SANITIZAR NOMBRE: Quitamos los espacios y símbolos raros de WhatsApp
                        const nombreLimpio = archivo.name.replace(/[^a-zA-Z0-9.]/g, "_");
                        const nombreUnicoAvatar = `avatar_${Date.now()}_${nombreLimpio}`;
                        
                        // Subimos la imagen a Firebase Storage
                        const referenciaAvatar = ref(storage, `avatars/${nombreUnicoAvatar}`);
                        await uploadBytes(referenciaAvatar, archivo);
                        const urlAvatarNube = await getDownloadURL(referenciaAvatar);

                        // Guardamos la URL en Firestore
                        if (datosLocales && datosLocales.token && datosLocales.token.includes('firebase_')) {
                            const uid = datosLocales.token.replace('firebase_', '');
                            const docRef = doc(db, "usuarios", uid);
                            await setDoc(docRef, { avatar: urlAvatarNube }, { merge: true });
                        }

                        // Actualizamos la pantalla
                        perfilImg.src = urlAvatarNube;
                        localStorage.setItem(claveAvatar, urlAvatarNube); 
                        
                        perfilNombre.textContent = "¡Foto Actualizada! ✅";
                        setTimeout(() => { perfilNombre.textContent = nombreOriginal; }, 2000);

                    } catch (error) {
                        console.error("Error al subir el avatar:", error);
                        perfilNombre.textContent = "❌ Error al subir";
                        setTimeout(() => { perfilNombre.textContent = nombreOriginal; }, 2000);
                        alert("Hubo un problema al subir tu foto. Revisa tu conexión a internet.");
                    }
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
// SISTEMA DE CAMBIO DE CONTRASEÑA (FIREBASE)
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

    // 2. Procesar el cambio de seguridad en la nube
    if (btnGuardarPass) {
        btnGuardarPass.addEventListener('click', async () => {
            const passActualInput = document.getElementById('pass-actual').value;
            const passNueva = document.getElementById('pass-nueva').value;
            const passConfirmar = document.getElementById('pass-confirmar').value;

            // Filtros de seguridad básicos
            if (!passActualInput || !passNueva || !passConfirmar) {
                alert("⚠️ Por favor, llena todos los campos.");
                return;
            }
            if (passNueva.length < 6) {
                alert("⚠️ La nueva contraseña debe tener al menos 6 caracteres.");
                return;
            }
            if (passNueva !== passConfirmar) {
                alert("⚠️ Las contraseñas nuevas no coinciden.");
                return;
            }

            // Identificamos al usuario activo en Firebase
            const usuarioFirebase = auth.currentUser;

            if (!usuarioFirebase) {
                alert("⚠️ Error: Sesión no detectada en la nube. Cierra sesión y vuelve a entrar.");
                return;
            }

            try {
                btnGuardarPass.textContent = 'VERIFICANDO EN LA NUBE...';
                btnGuardarPass.style.pointerEvents = 'none';
                btnGuardarPass.style.opacity = '0.7';

                // A) Reautenticamos al cliente para comprobar que no sea un hacker tratando de cambiar la clave
                const credenciales = EmailAuthProvider.credential(usuarioFirebase.email, passActualInput);
                await reauthenticateWithCredential(usuarioFirebase, credenciales);

                // B) Si la contraseña actual es correcta, guardamos la nueva en Google
                await updatePassword(usuarioFirebase, passNueva);

                alert("✅ ¡Contraseña actualizada con éxito! Tu cuenta está segura.");
                
                // Cerramos y limpiamos todo
                modalPass.style.display = 'none';
                document.getElementById('pass-actual').value = '';
                document.getElementById('pass-nueva').value = '';
                document.getElementById('pass-confirmar').value = '';

            } catch (error) {
                console.error("Error al cambiar contraseña:", error);
                if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
                    alert("❌ La contraseña actual es incorrecta.");
                } else if (error.code === 'auth/requires-recent-login') {
                    alert("⚠️ Por seguridad extrema, cierra sesión y vuelve a entrar antes de cambiar tu contraseña.");
                } else {
                    alert("❌ Error al actualizar: " + error.message);
                }
            } finally {
                btnGuardarPass.textContent = 'GUARDAR NUEVA CONTRASEÑA';
                btnGuardarPass.style.pointerEvents = 'auto';
                btnGuardarPass.style.opacity = '1';
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

// ==========================================
// 🔌 CERRAR SESIÓN GLOBAL (FUNCIONA EN TODAS LAS PÁGINAS)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
    
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', async (evento) => {
            evento.preventDefault(); // Evitamos saltos raros de página
            
            const confirmar = confirm("¿Estás seguro de que quieres cerrar sesión?");
            
            if (confirmar) {
                try {
                    // 1. Desconectar a la fuerza de la Bóveda de Google
                    await signOut(auth);

                    // 2. Barrer con todas las llaves VIP del celular/PC
                    localStorage.removeItem('usuario_mc_activo');
                    localStorage.removeItem('mc_usuario_activo');
                    localStorage.removeItem('mc_tiempo_sesion');
                    localStorage.removeItem('admin_mc_activo');
                    
                    // 3. Mandar al inicio de la página sin identidad
                    window.location.href = '/index.html';
                    
                } catch (error) {
                    console.error("Error al desconectar de la nube:", error);
                    alert("⚠️ Hubo un problema al cerrar sesión.");
                }
            }
        });
    }
});