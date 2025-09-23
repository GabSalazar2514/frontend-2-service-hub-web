
// ==========================================
// VARIABLES GLOBALES
// ==========================================


// Base de datos de usuarios simulada (en producción sería una API)
const usuariosDemo = [
    {
        id: 1,
        usuario: 'admin',
        contrasena: 'admin',
        nombre: 'Administrator',
        email: 'admin@servicehub.com',
        rol: 'admin',
        activo: true
    },
    {
        id: 2,
        usuario: 'gabriel',
        contrasena: 'gabriel123',
        nombre: 'Gabriel Salazar',
        email: 'gabriels@poli.edu.co',
        rol: 'usuario',
        activo: true
    },
];

// ==========================================
// FUNCIONES DE AUTENTICACIÓN
// ==========================================

async function procesarLogin(evento) {
    evento.preventDefault();
    
    const formulario = evento.target;
    const botonLogin = formulario.querySelector('.boton-login');
    
    // Obtener datos del formulario
    const datosLogin = {
        usuario: formulario.usuario.value.trim(),
        contrasena: formulario.contrasena.value
    };
    
    // Validar campos
    if (!validarDatosLogin(datosLogin)) {
        return;
    }
    
    // Mostrar estado de carga
    mostrarEstadoCarga(botonLogin, true);
    
    try {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Intentar autenticación
        const usuario = autenticarUsuario(datosLogin);
        
        if (usuario) {
            manejarLoginExitoso(usuario);
        } else {
            
            mostrarError(`Invalid credentials.`);
            
            // Limpiar campos
            document.getElementById('contrasena').value = '';
            document.getElementById('usuario').focus();
        }
        
    } catch (error) {
        console.error('Error durante el login:', error);
        mostrarError('Login error. Please try again.');
    } finally {
        mostrarEstadoCarga(botonLogin, false);
    }
}

function validarDatosLogin(datos) {
    // Limpiar errores previos
    limpiarErrores();
    
    let esValido = true;
    
    // Validar usuario
    if (!datos.usuario) {
        mostrarErrorCampo('usuario', 'Username is required');
        esValido = false;
    } else if (datos.usuario.length < 3) {
        mostrarErrorCampo('usuario', 'Username must be at least 3 characters');
        esValido = false;
    }
    
    // Validar contraseña
    if (!datos.contrasena) {
        mostrarErrorCampo('contrasena', 'Password is required');
        esValido = false;
    } else if (datos.contrasena.length < 4) {
        mostrarErrorCampo('contrasena', 'Password must be at least 4 characters');
        esValido = false;
    }
    
    return esValido;
}

function autenticarUsuario(datos) {
    return usuariosDemo.find(usuario => 
        usuario.usuario === datos.usuario && 
        usuario.contrasena === datos.contrasena &&
        usuario.activo === true
    );
}

function manejarLoginExitoso(usuario) {
    
    // Mostrar mensaje de éxito
    mostrarExito('Login successful! Redirecting...');
    
    // Redireccionar según el rol
    setTimeout(() => {
        if (usuario.rol === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'servicios.html';
        }
    }, 1500);
}

function generarToken() {
    return Date.now().toString(36) + Math.random().toString(36);
}

// ==========================================
// FUNCIONES DE RECUPERACIÓN DE CONTRASEÑA
// ==========================================

/**
 * Muestra el modal de recuperación de contraseña
 */
function mostrarRecuperacion() {
    const modal = document.getElementById('modalRecuperacion');
    modal.classList.remove('oculto');
    
    // Enfocar campo de email
    setTimeout(() => {
        document.getElementById('emailRecuperacion').focus();
    }, 100);
    
    // Cerrar con Escape
    document.addEventListener('keydown', cerrarModalConEscape);
}

/**
 * Cierra el modal de recuperación
 */
function cerrarModal() {
    const modal = document.getElementById('modalRecuperacion');
    modal.classList.add('oculto');
    
    // Limpiar campo
    document.getElementById('emailRecuperacion').value = '';
    
    // Remover listener de escape
    document.removeEventListener('keydown', cerrarModalConEscape);
}

/**
 * Cierra modal con tecla Escape
 * @param {KeyboardEvent} evento - Evento de teclado
 */
function cerrarModalConEscape(evento) {
    if (evento.key === 'Escape') {
        cerrarModal();
    }
}

/**
 * Envía email de recuperación de contraseña
 */
async function enviarRecuperacion() {
    const email = document.getElementById('emailRecuperacion').value.trim();
    
    if (!validarEmail(email)) {
        mostrarError('Please enter a valid email address.');
        return;
    }
    
    // Verificar si el email existe
    const usuarioExiste = usuariosDemo.some(usuario => 
        usuario.email.toLowerCase() === email.toLowerCase()
    );
    
    try {
        // Simular envío de email
        const botonEnviar = document.querySelector('.boton-enviar');
        mostrarEstadoCarga(botonEnviar, true, 'Sending...');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (usuarioExiste) {
            mostrarExito('Recovery instructions sent to your email.');
        } else {
            // Por seguridad, no revelar si el email existe o no
            mostrarExito('If the email exists, recovery instructions have been sent.');
        }
        
        setTimeout(() => {
            cerrarModal();
        }, 1500);
        
    } catch (error) {
        console.error('Error enviando recuperación:', error);
        mostrarError('Error sending email. Please try again.');
    } finally {
        const botonEnviar = document.querySelector('.boton-enviar');
        mostrarEstadoCarga(botonEnviar, false, 'Send');
    }
}

// ==========================================
// FUNCIONES DE INTERFAZ
// ==========================================


function mostrarEstadoCarga(boton, cargando, textoCarga = 'Loading...') {
    if (cargando) {
        boton.disabled = true;
        boton.textContent = textoCarga;
        boton.classList.add('cargando');
    } else {
        boton.disabled = false;
        boton.textContent = boton.dataset.textoOriginal || 'Login';
        boton.classList.remove('cargando');
    }
}


function deshabilitarFormulario(formulario, deshabilitar) {
    const campos = formulario.querySelectorAll('input, button');
    
    campos.forEach(campo => {
        campo.disabled = deshabilitar;
        if (deshabilitar) {
            campo.classList.add('deshabilitado');
        } else {
            campo.classList.remove('deshabilitado');
        }
    });
}


function mostrarErrorCampo(nombreCampo, mensaje) {
    const campo = document.getElementById(nombreCampo);
    const grupoError = campo.parentElement;
    
    // Remover error previo
    const errorPrevio = grupoError.querySelector('.mensaje-error');
    if (errorPrevio) {
        errorPrevio.remove();
    }
    
    // Agregar estilo de error
    campo.classList.add('campo-error');
    
    // Crear mensaje de error
    const mensajeError = document.createElement('span');
    mensajeError.className = 'mensaje-error';
    mensajeError.textContent = mensaje;
    mensajeError.style.color = '#e74c3c';
    mensajeError.style.fontSize = '0.8rem';
    mensajeError.style.marginTop = '0.5rem';
    mensajeError.style.display = 'block';
    
    grupoError.appendChild(mensajeError);
    
    // Enfocar campo
    campo.focus();
}

/**
 * Limpia todos los errores del formulario
 */
function limpiarErrores() {
    // Remover estilos de error
    const camposError = document.querySelectorAll('.campo-error');
    camposError.forEach(campo => campo.classList.remove('campo-error'));
    
    // Remover mensajes de error
    const mensajesError = document.querySelectorAll('.mensaje-error');
    mensajesError.forEach(mensaje => mensaje.remove());
    
    // Remover notificaciones
    const notificaciones = document.querySelectorAll('.notificacion');
    notificaciones.forEach(notif => notif.remove());
}

// ==========================================
// FUNCIONES DE NOTIFICACIÓN
// ==========================================

function mostrarError(mensaje) {
    mostrarNotificacion(mensaje, 'error');
}

function mostrarExito(mensaje) {
    mostrarNotificacion(mensaje, 'exito');
}


function mostrarInfo(mensaje) {
    mostrarNotificacion(mensaje, 'info');
}


function mostrarNotificacion(mensaje, tipo = 'info', duracion = 4000) {
    // Remover notificaciones existentes
    const notificacionesExistentes = document.querySelectorAll('.notificacion');
    notificacionesExistentes.forEach(notif => notif.remove());
    
    // Crear nueva notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;
    
    // Estilos
    notificacion.style.position = 'fixed';
    notificacion.style.top = '20px';
    notificacion.style.right = '20px';
    notificacion.style.padding = '1rem 1.5rem';
    notificacion.style.borderRadius = '8px';
    notificacion.style.color = 'white';
    notificacion.style.fontWeight = '600';
    notificacion.style.zIndex = '3000';
    notificacion.style.maxWidth = '400px';
    notificacion.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
    
    // Colores según tipo
    const colores = {
        'exito': '#27ae60',
        'error': '#e74c3c',
        'info': '#3498db',
        'advertencia': '#f39c12'
    };
    
    notificacion.style.background = colores[tipo] || colores['info'];
    
    document.body.appendChild(notificacion);
    
    // Animación de entrada
    notificacion.style.transform = 'translateX(100%)';
    notificacion.style.transition = 'transform 0.3s ease';
    
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 10);
    
    // Remover después del tiempo especificado
    setTimeout(() => {
        if (notificacion.parentNode) {
            notificacion.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notificacion.remove();
            }, 300);
        }
    }, duracion);
}

// ==========================================
// FUNCIONES DE VALIDACIÓN
// ==========================================


function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


function verificarFortalezaContrasena(contrasena) {
    const resultado = {
        fuerte: false,
        puntuacion: 0,
        sugerencias: []
    };
    
    // Criterios de fortaleza
    if (contrasena.length >= 8) resultado.puntuacion += 25;
    else resultado.sugerencias.push('At least 8 characters');
    
    if (/[a-z]/.test(contrasena)) resultado.puntuacion += 25;
    else resultado.sugerencias.push('Lowercase letters');
    
    if (/[A-Z]/.test(contrasena)) resultado.puntuacion += 25;
    else resultado.sugerencias.push('Uppercase letters');
    
    if (/\d/.test(contrasena)) resultado.puntuacion += 25;
    else resultado.sugerencias.push('Numbers');
    
    resultado.fuerte = resultado.puntuacion >= 75;
    
    return resultado;
}

// ==========================================
// FUNCIONES DE INICIALIZACIÓN
// ==========================================

function inicializarLogin() {
    console.log('Iniciando sistema de login ServiceHub');
    
    // Configurar formulario
    const formulario = document.getElementById('formularioLogin');
    if (formulario) {
        formulario.addEventListener('submit', procesarLogin);
    }
    
    // Configurar campos de entrada
    configurarCamposEntrada();
    
    // Enfocar primer campo
    const campoUsuario = document.getElementById('usuario');
    if (campoUsuario) {
        campoUsuario.focus();
    }
    
    // Configurar atajos de teclado
    document.addEventListener('keydown', manejarAtajosTeclado);
    
    // Mostrar información de usuarios demo
    mostrarInfoDemo();
    
    console.log('Sistema de login inicializado');
}


function configurarCamposEntrada() {
    const campos = document.querySelectorAll('.campo-entrada');
    
    campos.forEach(campo => {
        // Limpiar error al escribir
        campo.addEventListener('input', function() {
            this.classList.remove('campo-error');
            const mensaje = this.parentElement.querySelector('.mensaje-error');
            if (mensaje) {
                mensaje.remove();
            }
        });
        
        // Validación al perder foco
        campo.addEventListener('blur', function() {
            validarCampoIndividual(this);
        });
    });
}

function validarCampoIndividual(campo) {
    const valor = campo.value.trim();
    
    if (campo.id === 'usuario' && valor && valor.length < 3) {
        mostrarErrorCampo('usuario', 'Username must be at least 3 characters');
    } else if (campo.id === 'contrasena' && valor && valor.length < 4) {
        mostrarErrorCampo('contrasena', 'Password must be at least 4 characters');
    }
}

function manejarAtajosTeclado(evento) {
    // Enter en modal de recuperación
    if (evento.key === 'Enter') {
        const modal = document.getElementById('modalRecuperacion');
        if (!modal.classList.contains('oculto')) {
            evento.preventDefault();
            enviarRecuperacion();
        }
    }
    
    // Escape para cerrar modal
    if (evento.key === 'Escape') {
        cerrarModal();
    }
    
    // Ctrl + Enter para login rápido (solo desarrollo)
    if (evento.ctrlKey && evento.key === 'Enter' && window.location.hostname === 'localhost') {
        evento.preventDefault();
        loginDemo();
    }
}

/**
 * Login demo rápido para desarrollo
 */
function loginDemo() {
    document.getElementById('usuario').value = 'demo';
    document.getElementById('contrasena').value = 'demo';
    document.getElementById('formularioLogin').dispatchEvent(new Event('submit'));
}

/**
 * Muestra información sobre usuarios demo
 */
function mostrarInfoDemo() {
    // Solo en desarrollo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setTimeout(() => {
            mostrarInfo('Demo users: admin/admin (Rol Administrador)\ngabriel/gabriel123 (Rol Usuario)', 8000);
        }, 1000);
    }
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarLogin);

// Manejar errores globales
window.addEventListener('error', function(evento) {
    console.error('Error en login:', evento.error);
    mostrarError('An unexpected error occurred.');
});

// Exportar funciones para uso global
window.LoginServiceHub = {
    mostrarRecuperacion,
    cerrarModal,
    enviarRecuperacion,
    procesarLogin
};