// ==========================================
// 1. MENÚ MÓVIL (Hamburguesa) MEJORADO
// ==========================================
const iconoMenu = document.getElementById('icono-menu');
const menu = document.getElementById('menu');
// NUEVO: Buscamos todos los enlaces que viven adentro del menú
const enlacesMenu = document.querySelectorAll('#menu li a'); 

if (iconoMenu) {
    // Función 1: Abrir y cerrar tocando el ícono (La "X")
    iconoMenu.addEventListener('click', () => {
        menu.classList.toggle('activo');
        
        if (menu.classList.contains('activo')) {
    iconoMenu.classList.replace('bx-menu', 'bx-x'); // Aquí le pone la X
} else {
    iconoMenu.classList.replace('bx-x', 'bx-menu'); // Aquí vuelve a las rayitas
}
    });

    // Función 2: Cerrar automáticamente al tocar cualquier enlace
    enlacesMenu.forEach(enlace => {
        enlace.addEventListener('click', () => {
            // Ocultamos el menú
            menu.classList.remove('activo');
            // Regresamos el ícono de la "X" a las 3 rayitas
            iconoMenu.classList.replace('bx-x', 'bx-menu');
        });
    });
}

// ==========================================
// 2. CONTROL INTELIGENTE, PREVIEW Y NOTIFICACIÓN
// ==========================================

// A) CREAMOS EL GLOBO DE NOTIFICACIÓN INVISIBLE
const notificacion = document.createElement('div');
notificacion.id = 'notificacion-custom';
// Le metemos un ícono de Boxicons y un espacio para el texto
notificacion.innerHTML = `<i class='bx bx-info-circle' style='font-size: 24px;'></i> <span id="texto-notificacion"></span>`;
document.body.appendChild(notificacion);

// B) FUNCIÓN PARA MOSTRAR EL MENSAJE BONITO
function mostrarAlertaElegante(mensaje) {
    document.getElementById('texto-notificacion').textContent = mensaje;
    notificacion.classList.add('mostrar'); // Sube a la pantalla

    // Lo volvemos a esconder después de 4 segundos
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
    }, 4000);
}

// C) EL CONTROL DE LA MÚSICA
const todosLosAudios = document.querySelectorAll('audio');

todosLosAudios.forEach(audio => {
    
    // Pausar los demás al darle play a uno
    audio.addEventListener('play', () => {
        todosLosAudios.forEach(otroAudio => {
            if (otroAudio !== audio) {
                otroAudio.pause();
            }
        });
    });

    // El vigilante de los 30 segundos
    audio.addEventListener('timeupdate', () => {
        if (audio.currentTime >= 30) {
            audio.pause();           
            audio.currentTime = 0;   
            
            // ¡AQUÍ ESTÁ LA MAGIA! Llamamos a nuestra alerta elegante en vez del alert() feo
            mostrarAlertaElegante("¡Preview finalizado! Agrega el track al carrito para escucharlo completo.");
        }
    });

});



// ==========================================
// CONFIGURACIÓN DE LA BASE DE DATOS LOCAL
// ==========================================
// Leemos si ya hay algo guardado. Si no, creamos una lista vacía []
let carrito = JSON.parse(localStorage.getItem('mc_carrito')) || [];

// ==========================================
// 3. AGREGAR AL CARRITO (Desde la Tienda)
// ==========================================
const botonesComprar = document.querySelectorAll('.btn-comprar');

botonesComprar.forEach(boton => {
    boton.addEventListener('click', (evento) => {
        evento.preventDefault();
        
        // 1. Efecto visual del botón
        const textoOriginal = boton.textContent;
        boton.textContent = '¡AGREGADO!';
        boton.style.backgroundColor = 'var(--color-primario)';
        boton.style.color = 'white';
        setTimeout(() => {
            boton.textContent = textoOriginal;
            boton.style.backgroundColor = 'transparent';
        }, 2000); 

        // 2. EXTRAER LOS DATOS DEL PRODUCTO
        const tarjeta = boton.closest('.album');
        const producto = {
            imagen: tarjeta.querySelector('img').src,
            artista: tarjeta.querySelector('h4').textContent,
            // Tomamos el primer <p> que es el título del álbum
            titulo: tarjeta.querySelectorAll('p')[0].textContent, 
            precio: tarjeta.querySelector('.precio').textContent
        };

        // 3. GUARDAR EN LOCALSTORAGE
        carrito.push(producto); // Lo metemos a la lista
        localStorage.setItem('mc_carrito', JSON.stringify(carrito)); // Lo guardamos en el navegador
    });
});

// ==========================================
// 4. FILTROS DE LA TIENDA
// ==========================================
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
                if (producto.hasAttribute('data-categoria')) {
                    const categoriaProducto = producto.getAttribute('data-categoria').toUpperCase();
                    if (categoriaBoton === 'TODO' || categoriaBoton === categoriaProducto) {
                        producto.style.display = 'block'; 
                    } else {
                        producto.style.display = 'none'; 
                    }
                }
            });
        });
    });
}

// ==========================================
// 5. RENDERIZAR Y MANEJAR EL CARRITO
// ==========================================
const contenedorCarrito = document.getElementById('lista-carrito');
const elementoTotal = document.querySelector('.total-precio');

// Esta función "dibuja" los productos en la pantalla del carrito
function actualizarPantallaCarrito() {
    // Si no estamos en la página del carrito, no hacemos nada
    if (!contenedorCarrito) return; 

    // Si el carrito está vacío, mostramos el diseño de "Carrito Vacío"
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

    // Si hay productos, los dibujamos uno por uno
    contenedorCarrito.innerHTML = ''; // Limpiamos la caja primero
    let totalDinero = 0;

    carrito.forEach((item, index) => {
        // Sumamos el precio (quitando el símbolo $)
        totalDinero += parseFloat(item.precio.replace('$', ''));

        // Creamos el HTML del producto y le ponemos un número de índice (data-index) para saber cuál borrar después
        contenedorCarrito.innerHTML += `
            <article class="item-carrito" data-index="${index}">
                <img src="${item.imagen}" alt="Album">
                <div class="info-carrito">
                    <h3>${item.titulo}</h3>
                    <p>${item.artista}</p>
                </div>
                <p class="precio-carrito">${item.precio}</p>
                <button class="btn-eliminar"><i class='bx bx-trash' style="font-size: 20px;"></i></button>
            </article>
        `;
    });

    // Actualizamos el total de abajo
    if (elementoTotal) {
        elementoTotal.textContent = '$' + totalDinero.toFixed(2);
    }
}

// Ejecutamos la función apenas cargue la página
actualizarPantallaCarrito();

// Lógica para el botón de eliminar (La Papelera)
if (contenedorCarrito) {
    contenedorCarrito.addEventListener('click', (evento) => {
        // Verificamos si lo que se tocó fue el botón de eliminar o el ícono
        const botonEliminar = evento.target.closest('.btn-eliminar');
        
        if (botonEliminar) {
            // Buscamos qué número de producto era
            const articulo = botonEliminar.closest('.item-carrito');
            const indice = articulo.getAttribute('data-index');

            // Efecto visual de borrado
            articulo.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            articulo.style.opacity = "0";
            articulo.style.transform = "scale(0.9)";

            setTimeout(() => {
                // Lo borramos de la memoria
                carrito.splice(indice, 1);
                localStorage.setItem('mc_carrito', JSON.stringify(carrito));
                
                // Volvemos a dibujar la pantalla actualizada
                actualizarPantallaCarrito();
            }, 300);
        }
    });
}

// ==========================================
// 6. SISTEMA DE USUARIOS (LOGIN Y REGISTRO)
// ==========================================
const formRegistro = document.getElementById('form-register');
const formLogin = document.getElementById('form-login');
const mensajeError = document.getElementById('mensaje-error');

// Simulamos nuestra Base de Datos conectándonos al LocalStorage
// Si no hay usuarios guardados aún, creamos una lista vacía []
let usuariosBD = JSON.parse(localStorage.getItem('mc_usuarios')) || [];

// --- FUNCIÓN RECICLABLE: OJITOS DE CONTRASEÑA ---
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

// Activamos los ojitos (funcionará tanto en Login como en Register si existen)
configurarOjito('password', 'toggle-password');
configurarOjito('confirmar-password', 'toggle-confirm-password');

// --- LÓGICA DE REGISTRO (register.html) ---
if (formRegistro) {
    formRegistro.addEventListener('submit', (evento) => {
        evento.preventDefault();
        
        const usuario = document.getElementById('usuario').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmar-password').value;
        const btnSubmit = formRegistro.querySelector('button');

        // 1. Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            mensajeError.textContent = "Las contraseñas no coinciden.";
            mensajeError.style.display = "block";
            return;
        }

        // 2. Validar que la contraseña sea segura
        if (password.length < 6) {
            mensajeError.textContent = "La contraseña debe tener al menos 6 caracteres.";
            mensajeError.style.display = "block";
            return;
        }

        // 3. Validar que el correo no esté registrado antes
        const usuarioExiste = usuariosBD.find(user => user.correo === email);
        if (usuarioExiste) {
            mensajeError.textContent = "Este correo ya está registrado. Inicia sesión.";
            mensajeError.style.display = "block";
            return;
        }

        // Si todo está bien, ocultamos errores y procedemos a guardar
        mensajeError.style.display = "none";

        // Creamos el perfil del nuevo usuario
        const nuevoUsuario = {
            nombre: usuario,
            correo: email,
            clave: password
        };

        // Lo metemos a la base de datos y guardamos
        usuariosBD.push(nuevoUsuario);
        localStorage.setItem('mc_usuarios', JSON.stringify(usuariosBD));

        // Animación de éxito
        btnSubmit.textContent = 'CREANDO CUENTA...';
        btnSubmit.style.opacity = '0.7';
        btnSubmit.style.pointerEvents = 'none';

        // Lo mandamos al login para que inicie sesión con su nueva cuenta
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    });
}

// --- LÓGICA DE LOGIN (login.html) ---
if (formLogin) {
    formLogin.addEventListener('submit', (evento) => {
        evento.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btnSubmit = formLogin.querySelector('button');

        // 1. Buscamos al usuario en nuestra base de datos
        const usuarioEncontrado = usuariosBD.find(user => user.correo === email);

        if (!usuarioEncontrado) {
            mensajeError.textContent = "Este correo no está registrado.";
            mensajeError.style.display = "block";
            return;
        }

        // 2. Si el correo existe, verificamos la contraseña
        if (usuarioEncontrado.clave !== password) {
            mensajeError.textContent = "Contraseña incorrecta.";
            mensajeError.style.display = "block";
            return;
        }

        // Si todo es correcto, le damos acceso
        mensajeError.style.display = "none";

        // Creamos su "Gafete VIP" para que navegue
        const datosSesion = {
            nombre: usuarioEncontrado.nombre,
            correo: email,
            token: "mc_" + Math.random().toString(36).substr(2, 9)
        };
        localStorage.setItem('mc_usuario_activo', JSON.stringify(datosSesion));

        // Animación de acceso
        btnSubmit.textContent = 'VERIFICANDO...';
        btnSubmit.style.opacity = '0.7';
        btnSubmit.style.pointerEvents = 'none';

        // Lo dejamos pasar a la tienda
        setTimeout(() => {
            window.location.href = "/assets/pages/tienda.html";
        }, 1500);
    });
}

