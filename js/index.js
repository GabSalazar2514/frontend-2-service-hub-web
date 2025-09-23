
// ==========================================
// VARIABLES GLOBALES
// ==========================================

let datosUsuario = null;
let serviciosDestacados = [];

// ==========================================
// FUNCIONES DE NAVEGACIÓN
// ==========================================

/**
 * Navega a la página de servicios
 */
function navegarAServicios() {
    mostrarNotificacion('Redirecting to services...', 'info');
    setTimeout(() => {
        window.location.href = '../pages/servicios.html';
    }, 1000);
}

/**
 * Navega a la página de login
 */
function navegarALogin() {
    window.location.href = 'login.html';
}

function navegarASeccion(seccion) {
    const seccionesValidas = {
        'about': '#about',
        'contact': '#contact',
        'services': 'servicios.html',
        'login': 'login.html'
    };
    
    if (seccionesValidas[seccion]) {
        if (seccionesValidas[seccion].startsWith('#')) {
            // Scroll suave a sección
            const elemento = document.querySelector(seccionesValidas[seccion]);
            if (elemento) {
                elemento.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Navegación a otra página
            window.location.href = seccionesValidas[seccion];
        }
    }
}

// ==========================================
// FUNCIONES DE ANIMACIÓN
// ==========================================

/**
 * Anima las tarjetas de servicios al cargar
 */
function animarTarjetasServicio() {
    const tarjetas = document.querySelectorAll('.tarjeta-servicio');
    
    tarjetas.forEach((tarjeta, indice) => {
        tarjeta.style.opacity = '0';
        tarjeta.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            tarjeta.style.transition = 'all 0.6s ease';
            tarjeta.style.opacity = '1';
            tarjeta.style.transform = 'translateY(0)';
        }, indice * 200);
    });
}

/**
 * Añade efectos de hover a elementos interactivos
 */
function configurarEfectosHover() {
    // Efecto para tarjetas de servicio
    const tarjetas = document.querySelectorAll('.tarjeta-servicio');
    
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        tarjeta.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Efecto para el botón principal
    const botonRegistro = document.querySelector('.boton-registro');
    if (botonRegistro) {
        botonRegistro.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        botonRegistro.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
}

// ==========================================
// FUNCIONES DE UTILIDAD
// ==========================================

function mostrarNotificacion(mensaje, tipo = 'info', duracion = 3000) {
    // Remover notificaciones existentes
    const notificacionesExistentes = document.querySelectorAll('.notificacion');
    notificacionesExistentes.forEach(notif => notif.remove());
    
    // Crear nueva notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    // Remover después del tiempo especificado
    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.remove();
        }
    }, duracion);
}

/**
 * Valida si el navegador soporta las funcionalidades necesarias
 */
function validarCompatibilidadNavegador() {
    const caracteristicasNecesarias = [
        'localStorage',
        'JSON',
        'addEventListener'
    ];
    
    let compatible = true;
    const caracteristicasFaltantes = [];
    
    caracteristicasNecesarias.forEach(caracteristica => {
        if (!window[caracteristica]) {
            compatible = false;
            caracteristicasFaltantes.push(caracteristica);
        }
    });
    
    if (!compatible) {
        console.warn('Navegador no compatible. Características faltantes:', caracteristicasFaltantes);
        mostrarNotificacion('Your browser may not support all features', 'advertencia', 5000);
    }
    
    return compatible;
}

/**
 * Obtiene información del usuario desde localStorage
 */
function obtenerDatosUsuario() {
    try {
        const datosGuardados = localStorage.getItem('servicehub_usuario');
        if (datosGuardados) {
            datosUsuario = JSON.parse(datosGuardados);
            actualizarInterfazUsuario();
        }
    } catch (error) {
        console.error('Error al obtener datos de usuario:', error);
    }
}

/**
 * Actualiza la interfaz según el estado del usuario
 */
function actualizarInterfazUsuario() {
    const enlaceLogin = document.querySelector('a[href="login.html"]');
    
    if (datosUsuario && enlaceLogin) {
        enlaceLogin.textContent = `Welcome, ${datosUsuario.nombre}`;
        enlaceLogin.href = '#';
        enlaceLogin.addEventListener('click', mostrarMenuUsuario);
    }
}

function mostrarMenuUsuario(evento) {
    evento.preventDefault();
    
    const menuExistente = document.querySelector('.menu-usuario');
    if (menuExistente) {
        menuExistente.remove();
        return;
    }
    
    const menu = document.createElement('div');
    menu.className = 'menu-usuario';
    menu.innerHTML = `
        <div class="opciones-usuario">
            <a href="#" onclick="verPerfil()">My Profile</a>
            <a href="#" onclick="verMisServicios()">My Services</a>
            <a href="#" onclick="cerrarSesion()">Logout</a>
        </div>
    `;
    
    // Posicionar el menú
    const rect = evento.target.getBoundingClientRect();
    menu.style.position = 'absolute';
    menu.style.top = `${rect.bottom + 10}px`;
    menu.style.right = '20px';
    menu.style.background = 'white';
    menu.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
    menu.style.borderRadius = '10px';
    menu.style.padding = '1rem';
    menu.style.zIndex = '2000';
    
    document.body.appendChild(menu);
    
    // Cerrar menú al hacer click fuera
    setTimeout(() => {
        document.addEventListener('click', cerrarMenuUsuario);
    }, 100);
}


function cerrarMenuUsuario(evento) {
    const menu = document.querySelector('.menu-usuario');
    if (menu && !menu.contains(evento.target)) {
        menu.remove();
        document.removeEventListener('click', cerrarMenuUsuario);
    }
}

/**
 * Cierra la sesión del usuario
 */
function cerrarSesion() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('servicehub_usuario');
        mostrarNotificacion('Session closed successfully', 'exito');
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
}

/**
 * Funciones de perfil de usuario (placeholder)
 */
function verPerfil() {
    mostrarNotificacion('Profile feature coming soon', 'info');
}

function verMisServicios() {
    mostrarNotificacion('My Services feature coming soon', 'info');
}

// ==========================================
// FUNCIONES DE SCROLL
// ==========================================

/**
 * Maneja efectos visuales durante el scroll
 */
function manejarScroll() {
    const encabezado = document.querySelector('.encabezado-principal');
    const scrollY = window.scrollY;
    
    // Efecto de transparencia en el encabezado
    if (scrollY > 50) {
        encabezado.style.background = 'rgba(255, 255, 255, 0.95)';
        encabezado.style.backdropFilter = 'blur(10px)';
    } else {
        encabezado.style.background = '#fff';
        encabezado.style.backdropFilter = 'none';
    }
    
    // Animación de elementos al entrar en vista
    const elementosAnimables = document.querySelectorAll('.tarjeta-servicio');
    
    elementosAnimables.forEach(elemento => {
        const rect = elemento.getBoundingClientRect();
        const enVista = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (enVista && !elemento.classList.contains('animado')) {
            elemento.classList.add('animado');
            elemento.style.animation = 'slideUp 0.8s ease forwards';
        }
    });
}

// ==========================================
// FUNCIONES DE INICIALIZACIÓN
// ==========================================

/**
 * Inicializa todos los componentes de la página
 */
function inicializarPagina() {
    console.log('Iniciando ServiceHub - Página Principal');
    
    // Validar compatibilidad
    validarCompatibilidadNavegador();
    
    // Obtener datos de usuario
    obtenerDatosUsuario();
    
    // Configurar animaciones
    animarTarjetasServicio();
    configurarEfectosHover();
    
    // Configurar event listeners
    window.addEventListener('scroll', manejarScroll);
    
    // Configurar navegación por teclado
    document.addEventListener('keydown', manejarTecladoNavegacion);
    
    console.log('ServiceHub inicializado correctamente');
    mostrarNotificacion('Welcome to ServiceHub!', 'exito', 2000);
}


function manejarTecladoNavegacion(evento) {
    // Atajo Ctrl + K para búsqueda rápida
    if (evento.ctrlKey && evento.key === 'k') {
        evento.preventDefault();
        navegarAServicios();
    }
    
    // Escape para cerrar menús
    if (evento.key === 'Escape') {
        const menu = document.querySelector('.menu-usuario');
        if (menu) {
            menu.remove();
        }
    }
}

// ==========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializarPagina);

// Manejar errores globales
window.addEventListener('error', function(evento) {
    console.error('Error en ServiceHub:', evento.error);
    mostrarNotificacion('An error occurred. Please refresh the page.', 'error');
});

// Exportar funciones para uso global (si es necesario)
window.ServiceHub = {
    navegarAServicios,
    navegarALogin,
    navegarASeccion,
    mostrarNotificacion
};