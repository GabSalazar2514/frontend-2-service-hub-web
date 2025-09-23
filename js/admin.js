// Configurar navegación
    configurarNavegacionAdmin();
    
    // Mostrar sección inicial
    mostrarSeccion('dashboard');
    
    // Configurar event listeners
    configurarEventListenersAdmin();
    
    // Cargar estadísticas iniciales
    cargarEstadisticasIniciales();
    
    // Configurar actualizaciones automáticas
    configurarActualizacionAutomatica();
    
    console.log('Panel de administración inicializado correctamente');
    mostrarNotificacion('Welcome to ServiceHub Admin Panel', 'exito', 2000);
}

/**
 * Verifica si el usuario tiene permisos de administrador
 * @returns {boolean} - True si es administrador
 */
function verificarAutenticacionAdmin() {
    try {
        const datosUsuario = localStorage.getItem('servicehub_usuario');
        if (!datosUsuario) return false;
        
        datosAdmin = JSON.parse(datosUsuario);
        return datosAdmin.rol === 'admin';
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        return false;
    }
}

/**
 * Redirige al login si no está autenticado
 */
function redirigirALogin() {
    mostrarNotificacion('Access denied. Administrator privileges required.', 'error');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

/**
 * Carga datos iniciales del sistema
 */
function cargarDatosAdmin() {
    // Cargar desde localStorage o usar datos simulados
    serviciosAdmin = JSON.parse(localStorage.getItem('servicehub_servicios_admin') || JSON.stringify(datosSimulados.servicios));
    usuariosAdmin = JSON.parse(localStorage.getItem('servicehub_usuarios_admin') || JSON.stringify(datosSimulados.usuarios));
    solicitudesAdmin = JSON.parse(localStorage.getItem('servicehub_solicitudes') || '[]');
    
    // Configuración del sistema
    configuracionSistema = JSON.parse(localStorage.getItem('servicehub_config') || JSON.stringify({
        nombreSistema: 'ServiceHub',
        emailAdmin: 'admin@servicehub.com',
        version: '1.0.0',
        mantenimiento: false
    }));
}

/**
 * Configura la navegación del panel admin
 */
function configurarNavegacionAdmin() {
    const enlacesAdmin = document.querySelectorAll('.enlace-admin');
    
    enlacesAdmin.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            if (this.classList.contains('enlace-salir')) return; // No procesar logout
            
            e.preventDefault();
            const seccion = this.textContent.toLowerCase().replace(/\s+/g, '');
            mostrarSeccion(seccion);
            
            // Actualizar navegación activa
            enlacesAdmin.forEach(e => e.classList.remove('activo'));
            this.classList.add('activo');
        });
    });
}

// ==========================================
// FUNCIONES DE NAVEGACIÓN ENTRE SECCIONES
// ==========================================


function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    const seccionesAdmin = document.querySelectorAll('.seccion-admin');
    seccionesAdmin.forEach(s => s.classList.add('oculto'));
    
    // Mostrar sección solicitada
    const seccionObjetivo = document.getElementById(`seccion${capitalize(seccion)}`);
    if (seccionObjetivo) {
        seccionObjetivo.classList.remove('oculto');
        seccionActual = seccion;
        
        // Cargar contenido específico de la sección
        switch (seccion) {
            case 'dashboard':
                cargarDashboard();
                break;
            case 'servicios':
                cargarGestionServicios();
                break;
            case 'usuarios':
                cargarGestionUsuarios();
                break;
            case 'configuracion':
                cargarConfiguracion();
                break;
        }
    }
}

/**
 * Capitaliza la primera letra de una cadena
 * @param {string} str - Cadena a capitalizar
 * @returns {string} - Cadena capitalizada
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==========================================
// FUNCIONES DEL DASHBOARD
// ==========================================

/**
 * Carga y actualiza el contenido del dashboard
 */
function cargarDashboard() {
    // Actualizar actividad de usuarios
    actualizarActividadUsuarios();
    
    // Mostrar métricas generales
    mostrarMetricasGenerales();
    
    // Configurar gráficos si están disponibles
    configurarGraficos();
}

/**
 * Actualiza la lista de actividad de usuarios
 */
function actualizarActividadUsuarios() {
    const listaActividad = document.getElementById('listaActividad');
    if (!listaActividad) return;
    
    // Combinar actividad real con simulada
    const actividadCompleta = [...datosSimulados.actividad];
    
    // Agregar actividad de solicitudes recientes
    solicitudesAdmin.slice(-5).forEach(solicitud => {
        const usuario = usuariosAdmin.find(u => u.id === solicitud.usuarioId);
        if (usuario) {
            actividadCompleta.unshift({
                usuario: usuario.nombre,
                accion: `requested ${solicitud.detalles?.nombre || 'service'}`,
                fecha: new Date(solicitud.fechaSolicitud)
            });
        }
    });
    
    // Generar HTML de actividad
    const actividadHTML = actividadCompleta.slice(0, 10).map(actividad => {
        const tiempoTranscurrido = formatearTiempoTranscurrido(actividad.fecha);
        return `
            <div class="item-actividad">
                <span class="usuario-actividad">${actividad.usuario}</span>
                <span class="accion-actividad">${actividad.accion}</span>
                <span class="tiempo-actividad">${tiempoTranscurrido}</span>
            </div>
        `;
    }).join('');
    
    listaActividad.innerHTML = actividadHTML;
}

/**
 * Muestra métricas generales del sistema
 */
function mostrarMetricasGenerales() {
    const metricas = {
        totalUsuarios: usuariosAdmin.length,
        usuariosActivos: usuariosAdmin.filter(u => u.estado === 'activo').length,
        totalServicios: serviciosAdmin.length,
        serviciosActivos: serviciosAdmin.filter(s => s.estado === 'activo').length,
        solicitudesHoy: solicitudesAdmin.filter(s => 
            new Date(s.fechaSolicitud).toDateString() === new Date().toDateString()
        ).length,
        ingresosMes: calcularIngresosMes()
    };
    
    console.log('Métricas del sistema:', metricas);
    
    // Actualizar contadores en el DOM si existen
    actualizarContadoresMetricas(metricas);
}

/**
 * Actualiza contadores de métricas en la interfaz
 * @param {Object} metricas - Objeto con las métricas
 */
function actualizarContadoresMetricas(metricas) {
    const contadores = {
        '.contador-usuarios': metricas.totalUsuarios,
        '.contador-usuarios-activos': metricas.usuariosActivos,
        '.contador-servicios': metricas.totalServicios,
        '.contador-solicitudes-hoy': metricas.solicitudesHoy
    };
    
    Object.entries(contadores).forEach(([selector, valor]) => {
        const elemento = document.querySelector(selector);
        if (elemento) {
            animarContador(elemento, valor);
        }
    });
}

/**
 * Anima un contador numérico
 * @param {HTMLElement} elemento - Elemento a animar
 * @param {number} valorFinal - Valor final del contador
 */
function animarContador(elemento, valorFinal) {
    const valorInicial = 0;
    const duracion = 2000;
    const incremento = valorFinal / (duracion / 16);
    let valorActual = valorInicial;
    
    const intervalo = setInterval(() => {
        valorActual += incremento;
        
        if (valorActual >= valorFinal) {
            elemento.textContent = valorFinal;
            clearInterval(intervalo);
        } else {
            elemento.textContent = Math.floor(valorActual);
        }
    }, 16);
}

// ==========================================
// FUNCIONES DE GESTIÓN DE SERVICIOS
// ==========================================

/**
 * Carga la sección de gestión de servicios
 */
function cargarGestionServicios() {
    const tablaBody = document.getElementById('tablaServiciosBody');
    if (!tablaBody) return;
    
    // Generar filas de la tabla
    const filasHTML = serviciosAdmin.map(servicio => `
        <tr data-servicio-id="${servicio.id}">
            <td>
                <div class="nombre-servicio">
                    ${servicio.nombre}
                    <small class="id-servicio">${servicio.id}</small>
                </div>
            </td>
            <td>
                <span class="etiqueta-categoria">${servicio.categoria}</span>
            </td>
            <td class="precio-tabla">${servicio.precio}</td>
            <td>
                <span class="estado-${servicio.estado}">${capitalize(servicio.estado)}</span>
            </td>
            <td>
                <button class="boton-tabla boton-editar" onclick="editarServicio('${servicio.id}')">Edit</button>
                <button class="boton-tabla boton-eliminar" onclick="eliminarServicio('${servicio.id}')">Delete</button>
                <button class="boton-tabla boton-estadisticas" onclick="verEstadisticasServicio('${servicio.id}')">Stats</button>
            </td>
        </tr>
    `).join('');
    
    tablaBody.innerHTML = filasHTML;
}

/**
 * Muestra el formulario para agregar/actualizar servicio
 * @param {string} tipo - 'agregar' o 'actualizar'
 * @param {string} idServicio - ID del servicio (solo para actualizar)
 */
function mostrarFormularioServicio(tipo, idServicio = null) {
    const modal = document.getElementById('modalAdmin');
    const titulo = document.getElementById('tituloModal');
    const formulario = document.getElementById('formularioServicioAdmin');
    
    // Configurar título del modal
    titulo.textContent = tipo === 'agregar' ? 'Add New Service' : 'Update Service';
    
    // Si es actualización, llenar campos con datos existentes
    if (tipo === 'actualizar' && idServicio) {
        const servicio = serviciosAdmin.find(s => s.id === idServicio);
        if (servicio) {
            document.getElementById('nombreServicioAdmin').value = servicio.nombre;
            document.getElementById('categoriaServicioAdmin').value = servicio.categoria;
            document.getElementById('precioServicioAdmin').value = servicio.precio;
            document.getElementById('descripcionServicioAdmin').value = servicio.descripcion || '';
        }
    } else {
        formulario.reset();
    }
    
    // Guardar tipo y ID para el submit
    formulario.dataset.tipo = tipo;
    formulario.dataset.servicioId = idServicio || '';
    
    modal.classList.remove('oculto');
}

/**
 * Procesa el formulario de servicio
 * @param {Event} evento - Evento de submit del formulario
 */
async function procesarFormularioServicio(evento) {
    evento.preventDefault();
    
    const formulario = evento.target;
    const tipo = formulario.dataset.tipo;
    const servicioId = formulario.dataset.servicioId;
    
    // Obtener datos del formulario
    const datosServicio = {
        nombre: formulario.nombreServicioAdmin.value.trim(),
        categoria: formulario.categoriaServicioAdmin.value,
        precio: parseFloat(formulario.precioServicioAdmin.value),
        descripcion: formulario.descripcionServicioAdmin.value.trim(),
        estado: 'activo',
        fechaModificacion: new Date().toISOString()
    };
    
    // Validar datos
    if (!validarDatosServicio(datosServicio)) {
        return;
    }
    
    try {
        if (tipo === 'agregar') {
            // Generar ID único
            datosServicio.id = generarIdServicio(datosServicio.nombre);
            datosServicio.fechaCreacion = new Date().toISOString();
            datosServicio.solicitudes = 0;
            datosServicio.proveedor = 'ServiceHub Admin';
            
            // Agregar a la lista
            serviciosAdmin.push(datosServicio);
            
            mostrarNotificacion('Service added successfully', 'exito');
            
        } else if (tipo === 'actualizar') {
            // Actualizar servicio existente
            const indice = serviciosAdmin.findIndex(s => s.id === servicioId);
            if (indice !== -1) {
                serviciosAdmin[indice] = { ...serviciosAdmin[indice], ...datosServicio };
                mostrarNotificacion('Service updated successfully', 'exito');
            }
        }
        
        // Guardar cambios
        guardarDatosAdmin();
        
        // Cerrar modal y recargar tabla
        cerrarModalAdmin();
        cargarGestionServicios();
        
    } catch (error) {
        console.error('Error procesando servicio:', error);
        mostrarNotificacion('Error processing service', 'error');
    }
}

/**
 * Valida los datos del servicio
 * @param {Object} datos - Datos a validar
 * @returns {boolean} - True si son válidos
 */
function validarDatosServicio(datos) {
    if (!datos.nombre || datos.nombre.length < 3) {
        mostrarNotificacion('Service name must be at least 3 characters', 'error');
        return false;
    }
    
    if (!datos.categoria) {
        mostrarNotificacion('Category is required', 'error');
        return false;
    }
    
    if (!datos.precio || datos.precio <= 0) {
        mostrarNotificacion('Valid price is required', 'error');
        return false;
    }
    
    return true;
}

/**
 * Genera un ID único para el servicio
 * @param {string} nombre - Nombre del servicio
 * @returns {string} - ID generado
 */
function generarIdServicio(nombre) {
    const base = nombre.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
    
    return base + '-' + Date.now().toString(36);
}

/**
 * Edita un servicio específico
 * @param {string} idServicio - ID del servicio a editar
 */
function editarServicio(idServicio) {
    mostrarFormularioServicio('actualizar', idServicio);
}

/**
 * Elimina un servicio específico
 * @param {string} idServicio - ID del servicio a eliminar
 */
function eliminarServicio(idServicio) {
    const servicio = serviciosAdmin.find(s => s.id === idServicio);
    if (!servicio) return;
    
    if (confirm(`Are you sure you want to delete "${servicio.nombre}"?`)) {
        // Eliminar de la lista
        serviciosAdmin = serviciosAdmin.filter(s => s.id !== idServicio);
        
        // Guardar cambios
        guardarDatosAdmin();
        
        // Recargar tabla
        cargarGestionServicios();
        
        mostrarNotificacion('Service deleted successfully', 'exito');
    }
}

/**
 * Muestra estadísticas de un servicio específico
 * @param {string} idServicio - ID del servicio
 */
function verEstadisticasServicio(idServicio) {
    const servicio = serviciosAdmin.find(s => s.id === idServicio);
    if (!servicio) return;
    
    const solicitudesServicio = solicitudesAdmin.filter(s => s.servicioId === idServicio);
    const ingresos = solicitudesServicio.reduce((total, sol) => total + (sol.precio || 0), 0);
    
    const estadisticas = `
        <div class="modal-estadisticas">
            <div class="contenido-modal">
                <h3>Statistics: ${servicio.nombre}</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-number">${solicitudesServicio.length}</span>
                        <span class="stat-label">Total Requests</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${ingresos}</span>
                        <span class="stat-label">Total Revenue</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${servicio.estado}</span>
                        <span class="stat-label">Current Status</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${formatearFecha(servicio.fechaCreacion)}</span>
                        <span class="stat-label">Created Date</span>
                    </div>
                </div>
                <button onclick="cerrarModalEstadisticas()" class="boton-cerrar">Close</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', estadisticas);
}

/**
 * Cierra el modal de estadísticas
 */
function cerrarModalEstadisticas() {
    const modal = document.querySelector('.modal-estadisticas');
    if (modal) modal.remove();
}

// ==========================================
// FUNCIONES DE GESTIÓN DE USUARIOS
// ==========================================

/**
 * Carga la sección de gestión de usuarios
 */
function cargarGestionUsuarios() {
    // Actualizar estadísticas de usuarios
    const estadisticas = document.querySelectorAll('.tarjeta-estadistica');
    if (estadisticas.length >= 3) {
        estadisticas[0].querySelector('.numero-estadistica').textContent = usuariosAdmin.length;
        estadisticas[1].querySelector('.numero-estadistica').textContent = 
            usuariosAdmin.filter(u => u.estado === 'activo').length;
        estadisticas[2].querySelector('.numero-estadistica').textContent = 
            usuariosAdmin.filter(u => 
                new Date(u.fechaRegistro).getMonth() === new Date().getMonth()
            ).length;
    }
}

// ==========================================
// FUNCIONES DE REPORTES
// ==========================================

/**
 * Genera y descarga un reporte según el tipo seleccionado
 */
function generarReporte() {
    const tipoReporte = document.getElementById('tipoReporte').value;
    
    let datosReporte, nombreArchivo;
    
    switch (tipoReporte) {
        case 'service-usage':
            datosReporte = generarReporteUsoServicios();
            nombreArchivo = 'service-usage-report.json';
            break;
        case 'user-activity':
            datosReporte = generarReporteActividadUsuarios();
            nombreArchivo = 'user-activity-report.json';
            break;
        case 'revenue':
            datosReporte = generarReporteIngresos();
            nombreArchivo = 'revenue-report.json';
            break;
        case 'performance':
            datosReporte = generarReporteRendimiento();
            nombreArchivo = 'performance-report.json';
            break;
        default:
            mostrarNotificacion('Invalid report type', 'error');
            return;
    }
    
    // Descargar reporte
    descargarReporte(datosReporte, nombreArchivo);
    mostrarNotificacion(`${capitalize(tipoReporte.replace('-', ' '))} report generated`, 'exito');
}

/**
 * Genera reporte de uso de servicios
 * @returns {Object} - Datos del reporte
 */
function generarReporteUsoServicios() {
    return {
        fecha: new Date().toISOString(),
        tipo: 'service-usage',
        datos: serviciosAdmin.map(servicio => ({
            id: servicio.id,
            nombre: servicio.nombre,
            solicitudes: solicitudesAdmin.filter(s => s.servicioId === servicio.id).length,
            ingresos: solicitudesAdmin
                .filter(s => s.servicioId === servicio.id)
                .reduce((total, s) => total + (s.precio || 0), 0),
            estado: servicio.estado
        }))
    };
}

/**
 * Genera reporte de actividad de usuarios
 * @returns {Object} - Datos del reporte
 */
function generarReporteActividadUsuarios() {
    return {
        fecha: new Date().toISOString(),
        tipo: 'user-activity',
        datos: usuariosAdmin.map(usuario => ({
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            fechaRegistro: usuario.fechaRegistro,
            estado: usuario.estado,
            serviciosSolicitados: usuario.serviciosSolicitados,
            ultimaActividad: usuario.ultimaActividad
        }))
    };
}

/**
 * Genera reporte de ingresos
 * @returns {Object} - Datos del reporte
 */
function generarReporteIngresos() {
    const ingresosPorMes = {};
    const ingresosPorServicio = {};
    
    solicitudesAdmin.forEach(solicitud => {
        const fecha = new Date(solicitud.fechaSolicitud);
        const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        
        ingresosPorMes[mes] = (ingresosPorMes[mes] || 0) + (solicitud.precio || 0);
        ingresosPorServicio[solicitud.servicioId] = (ingresosPorServicio[solicitud.servicioId] || 0) + (solicitud.precio || 0);
    });
    
    return {
        fecha: new Date().toISOString(),
        tipo: 'revenue',
        ingresosTotales: Object.values(ingresosPorMes).reduce((total, ingreso) => total + ingreso, 0),
        ingresosPorMes,
        ingresosPorServicio
    };
}

/**
 * Genera reporte de rendimiento
 * @returns {Object} - Datos del reporte
 */
function generarReporteRendimiento() {
    return {
        fecha: new Date().toISOString(),
        tipo: 'performance',
        metricas: {
            totalUsuarios: usuariosAdmin.length,
            usuariosActivos: usuariosAdmin.filter(u => u.estado === 'activo').length,
            totalServicios: serviciosAdmin.length,
            serviciosActivos: serviciosAdmin.filter(s => s.estado === 'activo').length,
            totalSolicitudes: solicitudesAdmin.length,
            promedioSolicitudesPorUsuario: solicitudesAdmin.length / usuariosAdmin.length,
            servicioMasSolicitado: obtenerServicioMasSolicitado()
        }
    };
}

/**
 * Obtiene el servicio más solicitado
 * @returns {Object} - Datos del servicio más popular
 */
function obtenerServicioMasSolicitado() {
    const conteoServicios = {};
    
    solicitudesAdmin.forEach(solicitud => {
        conteoServicios[solicitud.servicioId] = (conteoServicios[solicitud.servicioId] || 0) + 1;
    });
    
    const servicioMasPopular = Object.entries(conteoServicios)
        .sort(([,a], [,b]) => b - a)[0];
    
    if (servicioMasPopular) {
        const servicio = serviciosAdmin.find(s => s.id === servicioMasPopular[0]);
        return {
            id: servicioMasPopular[0],
            nombre: servicio?.nombre || 'Unknown',
            solicitudes: servicioMasPopular[1]
        };
    }
    
    return null;
}

/**
 * Descarga un archivo con los datos del reporte
 * @param {Object} datos - Datos del reporte
 * @param {string} nombreArchivo - Nombre del archivo
 */
function descargarReporte(datos, nombreArchivo) {
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombreArchivo;
    enlace.click();
    
    URL.revokeObjectURL(url);
}

// ==========================================
// FUNCIONES DE CONFIGURACIÓN
// ==========================================

/**
 * Carga la sección de configuración del sistema
 */
function cargarConfiguracion() {
    // Llenar campos con configuración actual
    document.getElementById('nombreSistema').value = configuracionSistema.nombreSistema || 'ServiceHub';
    document.getElementById('emailAdmin').value = configuracionSistema.emailAdmin || 'admin@servicehub.com';
}

/**
 * Guarda la configuración del sistema
 */
function guardarConfiguracion() {
    const nuevaConfiguracion = {
        ...configuracionSistema,
        nombreSistema: document.getElementById('nombreSistema').value,
        emailAdmin: document.getElementById('emailAdmin').value,
        fechaModificacion: new Date().toISOString()
    };
    
    // Validar configuración
    if (!nuevaConfiguracion.nombreSistema.trim()) {
        mostrarNotificacion('System name is required', 'error');
        return;
    }
    
    if (!validarEmail(nuevaConfiguracion.emailAdmin)) {
        mostrarNotificacion('Valid admin email is required', 'error');
        return;
    }
    
    // Guardar configuración
    configuracionSistema = nuevaConfiguracion;
    localStorage.setItem('servicehub_config', JSON.stringify(configuracionSistema));
    
    mostrarNotificacion('Configuration saved successfully', 'exito');
}

// ==========================================
// FUNCIONES DE MODAL
// ==========================================

/**
 * Cierra el modal de administración
 */
function cerrarModalAdmin() {
    const modal = document.getElementById('modalAdmin');
    modal.classList.add('oculto');
    
    // Limpiar formulario
    const formulario = document.getElementById('formularioServicioAdmin');
    formulario.reset();
    delete formulario.dataset.tipo;
    delete formulario.dataset.servicioId;
}

// ==========================================
// FUNCIONES DE UTILIDAD
// ==========================================

/**
 * Configura event listeners específicos del panel admin
 */
function configurarEventListenersAdmin() {
    // Formulario de servicio
    const formularioServicio = document.getElementById('formularioServicioAdmin');
    if (formularioServicio) {
        formularioServicio.addEventListener('submit', procesarFormularioServicio);
    }
    
    // Filtro de actividad de usuarios
    const filtroActividad = document.getElementById('buscarUsuarios');
    if (filtroActividad) {
        filtroActividad.addEventListener('input', filtrarActividad);
    }
    
    // Configurar atajos de teclado
    document.addEventListener('keydown', manejarAtajosAdmin);
}

/**
 * Filtra la actividad de usuarios
 */
function filtrarActividad() {
    const termino = document.getElementById('buscarUsuarios').value.toLowerCase();
    const items = document.querySelectorAll('.item-actividad');
    
    items.forEach(item => {
        const texto = item.textContent.toLowerCase();
        item.style.display = texto.includes(termino) ? 'block' : 'none';
    });
}

/**
 * Configura actualizaciones automáticas del dashboard
 */
function configurarActualizacionAutomatica() {
    // Actualizar actividad cada 30 segundos
    setInterval(() => {
        if (seccionActual === 'dashboard') {
            actualizarActividadUsuarios();
        }
    }, 30000);
}

/**
 * Calcula los ingresos del mes actual
 * @returns {number} - Ingresos del mes
 */
function calcularIngresosMes() {
    const mesActual = new Date().getMonth();
    const anoActual = new Date().getFullYear();
    
    return solicitudesAdmin
        .filter(s => {
            const fecha = new Date(s.fechaSolicitud);
            return fecha.getMonth() === mesActual && fecha.getFullYear() === anoActual;
        })
        .reduce((total, s) => total + (s.precio || 0), 0);
}

/**
 * Formatea tiempo transcurrido
 * @param {Date} fecha - Fecha a formatear
 * @returns {string} - Tiempo formateado
 */
function formatearTiempoTranscurrido(fecha) {
    const ahora = new Date();
    const diff = ahora - fecha;
    
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    
    if (dias > 0) return `${dias}d ago`;
    if (horas > 0) return `${horas}h ago`;
    if (minutos > 0) return `${minutos}m ago`;
    return 'Just now';
}

/**
 * Formatea fecha para mostrar
 * @param {string} fecha - Fecha en formato ISO
 * @returns {string} - Fecha formateada
 */
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Guarda todos los datos administrativos en localStorage
 */
function guardarDatosAdmin() {
    try {
        localStorage.setItem('servicehub_servicios_admin', JSON.stringify(serviciosAdmin));
        localStorage.setItem('servicehub_usuarios_admin', JSON.stringify(usuariosAdmin));
        localStorage.setItem('servicehub_config', JSON.stringify(configuracionSistema));
    } catch (error) {
        console.error('Error guardando datos administrativos:', error);
        mostrarNotificacion('Error saving data', 'error');
    }
}

/**
 * Maneja atajos de teclado específicos del admin
 * @param {KeyboardEvent} evento - Evento de teclado
 */
function manejarAtajosAdmin(evento) {
    // Ctrl + N para nuevo servicio
    if (evento.ctrlKey && evento.key === 'n') {
        evento.preventDefault();
        if (seccionActual === 'servicios') {
            mostrarFormularioServicio('agregar');
        }
    }
    
    // Escape para cerrar modales
    if (evento.key === 'Escape') {
        cerrarModalAdmin();
        cerrarModalEstadisticas();
    }
    
    // F5 para actualizar datos
    if (evento.key === 'F5') {
        evento.preventDefault();
        location.reload();
    }
}

/**
 * Configura gráficos del dashboard (placeholder)
 */
function configurarGraficos() {
    // Aquí se podrían configurar gráficos usando bibliotecas como Chart.js
    console.log('Configurando gráficos del dashboard');
    
    // Ejemplo de datos para gráfico de servicios más solicitados
    const datosGrafico = serviciosAdmin.map(servicio => ({
        nombre: servicio.nombre,
        solicitudes: solicitudesAdmin.filter(s => s.servicioId === servicio.id).length
    }));
    
    console.log('Datos para gráfico de servicios:', datosGrafico);
}

/**
 * Carga estadísticas iniciales del sistema
 */
function cargarEstadisticasIniciales() {
    const estadisticas = {
        serviciosCreados: serviciosAdmin.length,
        usuariosRegistrados: usuariosAdmin.length,
        solicitudesTotal: solicitudesAdmin.length,
        ingresosTotales: solicitudesAdmin.reduce((total, s) => total + (s.precio || 0), 0)
    };
    
    console.log('Estadísticas iniciales cargadas:', estadisticas);
    
    // Mostrar en consola para desarrollo
    if (window.location.hostname === 'localhost') {
        console.table(estadisticas);
    }
}

/**
 * Exporta datos del sistema para respaldo
 */
function exportarDatosSistema() {
    const datosCompletos = {
        servicios: serviciosAdmin,
        usuarios: usuariosAdmin,
        solicitudes: solicitudesAdmin,
        configuracion: configuracionSistema,
        fechaExportacion: new Date().toISOString(),
        version: configuracionSistema.version || '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(datosCompletos, null, 2)], { 
        type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `servicehub-backup-${new Date().toISOString().split('T')[0]}.json`;
    enlace.click();
    
    URL.revokeObjectURL(url);
    mostrarNotificacion('System data exported successfully', 'exito');
}

/**
 * Importa datos del sistema desde archivo
 * @param {Event} evento - Evento de input file
 */
function importarDatosSistema(evento) {
    const archivo = evento.target.files[0];
    if (!archivo) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const datosImportados = JSON.parse(e.target.result);
            
            // Validar estructura de datos
            if (validarDatosImportados(datosImportados)) {
                // Confirmar importación
                if (confirm('This will overwrite existing data. Continue?')) {
                    serviciosAdmin = datosImportados.servicios || [];
                    usuariosAdmin = datosImportados.usuarios || [];
                    solicitudesAdmin = datosImportados.solicitudes || [];
                    configuracionSistema = datosImportados.configuracion || {};
                    
                    guardarDatosAdmin();
                    location.reload(); // Recargar para mostrar nuevos datos
                }
            } else {
                mostrarNotificacion('Invalid data format', 'error');
            }
        } catch (error) {
            console.error('Error importing data:', error);
            mostrarNotificacion('Error importing file', 'error');
        }
    };
    
    reader.readAsText(archivo);
}

/**
 * Valida la estructura de datos importados
 * @param {Object} datos - Datos a validar
 * @returns {boolean} - True si son válidos
 */
function validarDatosImportados(datos) {
    return (
        datos &&
        Array.isArray(datos.servicios) &&
        Array.isArray(datos.usuarios) &&
        Array.isArray(datos.solicitudes) &&
        typeof datos.configuracion === 'object'
    );
}

/**
 * Reinicia el sistema a configuración de fábrica
 */
function reiniciarSistema() {
    const confirmacion = prompt(
        'This will delete all data and reset to factory settings. Type "RESET" to confirm:'
    );
    
    if (confirmacion === 'RESET') {
        // Limpiar todos los datos
        localStorage.removeItem('servicehub_servicios_admin');
        localStorage.removeItem('servicehub_usuarios_admin');
        localStorage.removeItem('servicehub_solicitudes');
        localStorage.removeItem('servicehub_config');
        
        mostrarNotificacion('System reset completed. Reloading...', 'info');
        
        setTimeout(() => {
            location.reload();
        }, 2000);
    } else {
        mostrarNotificacion('Reset cancelled', 'info');
    }
}

/**
 * Muestra información del sistema
 */
function mostrarInfoSistema() {
    const info = `
        <div class="modal-info-sistema">
            <div class="contenido-modal">
                <h3>System Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>System Name:</strong> ${configuracionSistema.nombreSistema}
                    </div>
                    <div class="info-item">
                        <strong>Version:</strong> ${configuracionSistema.version || '1.0.0'}
                    </div>
                    <div class="info-item">
                        <strong>Admin Email:</strong> ${configuracionSistema.emailAdmin}
                    </div>
                    <div class="info-item">
                        <strong>Total Services:</strong> ${serviciosAdmin.length}
                    </div>
                    <div class="info-item">
                        <strong>Total Users:</strong> ${usuariosAdmin.length}
                    </div>
                    <div class="info-item">
                        <strong>Total Requests:</strong> ${solicitudesAdmin.length}
                    </div>
                    <div class="info-item">
                        <strong>Uptime:</strong> ${calcularUptime()}
                    </div>
                </div>
                <div class="acciones-sistema">
                    <button onclick="exportarDatosSistema()" class="boton-admin">Export Data</button>
                    <button onclick="mostrarLogsSistema()" class="boton-admin">View Logs</button>
                    <button onclick="ejecutarDiagnostico()" class="boton-admin">Run Diagnostics</button>
                </div>
                <button onclick="cerrarInfoSistema()" class="boton-cerrar">Close</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', info);
}

/**
 * Calcula el uptime del sistema
 * @returns {string} - Tiempo de actividad formateado
 */
function calcularUptime() {
    const inicioSesion = localStorage.getItem('servicehub_session_start');
    if (inicioSesion) {
        const diff = Date.now() - parseInt(inicioSesion);
        const horas = Math.floor(diff / 3600000);
        const minutos = Math.floor((diff % 3600000) / 60000);
        return `${horas}h ${minutos}m`;
    }
    return 'Session just started';
}

/**
 * Ejecuta diagnóstico del sistema
 */
function ejecutarDiagnostico() {
    const diagnostico = {
        timestamp: new Date().toISOString(),
        status: 'healthy',
        checks: {
            localStorage: !!window.localStorage,
            serviciosData: serviciosAdmin.length > 0,
            usuariosData: usuariosAdmin.length > 0,
            configurationValid: !!configuracionSistema.nombreSistema
        },
        memory: {
            servicios: JSON.stringify(serviciosAdmin).length,
            usuarios: JSON.stringify(usuariosAdmin).length,
            solicitudes: JSON.stringify(solicitudesAdmin).length
        }
    };
    
    console.log('System Diagnostics:', diagnostico);
    
    const todosLosChecksCorrectos = Object.values(diagnostico.checks).every(check => check);
    const estado = todosLosChecksCorrectos ? 'All systems operational' : 'Issues detected';
    
    mostrarNotificacion(`Diagnostics completed: ${estado}`, 
                       todosLosChecksCorrectos ? 'exito' : 'advertencia');
}

/**
 * Muestra logs del sistema
 */
function mostrarLogsSistema() {
    const logs = JSON.parse(localStorage.getItem('servicehub_logs') || '[]');
    
    const modalLogs = `
        <div class="modal-logs">
            <div class="contenido-modal-logs">
                <h3>System Logs</h3>
                <div class="contenedor-logs">
                    ${logs.length > 0 ? 
                        logs.slice(-50).map(log => `
                            <div class="log-entry log-${log.level}">
                                <span class="log-timestamp">${formatearFecha(log.timestamp)}</span>
                                <span class="log-message">${log.message}</span>
                            </div>
                        `).join('') :
                        '<p>No logs available</p>'
                    }
                </div>
                <div class="acciones-logs">
                    <button onclick="limpiarLogs()" class="boton-limpiar">Clear Logs</button>
                    <button onclick="exportarLogs()" class="boton-exportar">Export Logs</button>
                </div>
                <button onclick="cerrarLogs()" class="boton-cerrar">Close</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalLogs);
}

/**
 * Registra un log en el sistema
 * @param {string} message - Mensaje del log
 * @param {string} level - Nivel del log (info, warning, error)
 */
function registrarLog(message, level = 'info') {
    const logs = JSON.parse(localStorage.getItem('servicehub_logs') || '[]');
    
    logs.push({
        timestamp: new Date().toISOString(),
        message,
        level,
        user: datosAdmin?.nombre || 'System'
    });
    
    // Mantener solo los últimos 1000 logs
    if (logs.length > 1000) {
        logs.splice(0, logs.length - 1000);
    }
    
    localStorage.setItem('servicehub_logs', JSON.stringify(logs));
}

/**
 * Limpia los logs del sistema
 */
function limpiarLogs() {
    if (confirm('Are you sure you want to clear all logs?')) {
        localStorage.setItem('servicehub_logs', '[]');
        mostrarNotificacion('Logs cleared successfully', 'exito');
        cerrarLogs();
    }
}

/**
 * Exporta logs del sistema
 */
function exportarLogs() {
    const logs = JSON.parse(localStorage.getItem('servicehub_logs') || '[]');
    
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `servicehub-logs-${new Date().toISOString().split('T')[0]}.json`;
    enlace.click();
    
    URL.revokeObjectURL(url);
    mostrarNotificacion('Logs exported successfully', 'exito');
}

/**
 * Cierra modal de información del sistema
 */
function cerrarInfoSistema() {
    const modal = document.querySelector('.modal-info-sistema');
    if (modal) modal.remove();
}

/**
 * Cierra modal de logs
 */
function cerrarLogs() {
    const modal = document.querySelector('.modal-logs');
    if (modal) modal.remove();
}

/**
 * Muestra notificaciones en el panel admin
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de notificación
 * @param {number} duracion - Duración en milisegundos
 */
function mostrarNotificacion(mensaje, tipo = 'info', duracion = 3000) {
    // Registrar en logs
    registrarLog(`Notification: ${mensaje}`, tipo === 'error' ? 'error' : 'info');
    
    // Remover notificaciones existentes
    const existentes = document.querySelectorAll('.notificacion');
    existentes.forEach(notif => notif.remove());
    
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;
    
    const colores = {
        'exito': '#27ae60',
        'error': '#e74c3c',
        'info': '#3498db',
        'advertencia': '#f39c12'
    };
    
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colores[tipo]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 4000;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notificacion.style.transform = 'translateX(100%)';
        setTimeout(() => notificacion.remove(), 300);
    }, duracion);
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

// Guardar timestamp de inicio de sesión
if (!localStorage.getItem('servicehub_session_start')) {
    localStorage.setItem('servicehub_session_start', Date.now().toString());
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarAdmin);

// Registrar log de inicio
document.addEventListener('DOMContentLoaded', () => {
    registrarLog('Admin panel initialized');
});

// Manejar errores globales
window.addEventListener('error', function(evento) {
    console.error('Error en panel admin:', evento.error);
    registrarLog(`JavaScript error: ${evento.error?.message || 'Unknown error'}`, 'error');
    mostrarNotificacion('An error occurred. Check console for details.', 'error');
});

// Antes de cerrar la ventana, guardar datos
window.addEventListener('beforeunload', function() {
    guardarDatosAdmin();
    registrarLog('Admin session ended');
});

// Exportar funciones para uso global
window.AdminServiceHub = {
    mostrarSeccion,
    mostrarFormularioServicio,
    editarServicio,
    eliminarServicio,
    verEstadisticasServicio,
    generarReporte,
    guardarConfiguracion,
    cerrarModalAdmin,
    filtrarActividad,
    mostrarInfoSistema,
    exportarDatosSistema,
    importarDatosSistema,
    reiniciarSistema
};/**
 * SERVICEHUB - PANEL DE ADMINISTRACIÓN
 * Archivo de lógica JavaScript para el panel administrativo
 * Maneja gestión de servicios, usuarios, reportes y configuración
 */

// ==========================================
// VARIABLES GLOBALES
// ==========================================

let datosAdmin = null;
let seccionActual = 'dashboard';
let serviciosAdmin = [];
let usuariosAdmin = [];
let solicitudesAdmin = [];
let configuracionSistema = {};

// Datos simulados para el panel
const datosSimulados = {
    servicios: [
        {
            id: 'web-development',
            nombre: 'Web Development',
            categoria: 'categoria1',
            precio: 500,
            estado: 'activo',
            fechaCreacion: '2024-01-01',
            solicitudes: 15,
            proveedor: 'Tech Solutions Team'
        },
        {
            id: 'graphic-design',
            nombre: 'Graphic Design',
            categoria: 'categoria1',
            precio: 300,
            estado: 'activo',
            fechaCreacion: '2024-01-02',
            solicitudes: 8,
            proveedor: 'Creative Design Studio'
        },
        {
            id: 'premium-cleaning',
            nombre: 'Premium Cleaning',
            categoria: 'categoria2',
            precio: 125,
            estado: 'activo',
            fechaCreacion: '2024-01-03',
            solicitudes: 22,
            proveedor: 'ServiceHub Cleaning Team'
        }
    ],
    usuarios: [
        {
            id: 1,
            nombre: 'John Doe',
            email: 'john@example.com',
            fechaRegistro: '2024-01-05',
            estado: 'activo',
            serviciosSolicitados: 3,
            ultimaActividad: '2024-01-20'
        },
        {
            id: 2,
            nombre: 'Jane Smith',
            email: 'jane@example.com',
            fechaRegistro: '2024-01-10',
            estado: 'activo',
            serviciosSolicitados: 1,
            ultimaActividad: '2024-01-18'
        },
        {
            id: 3,
            nombre: 'Bob Johnson',
            email: 'bob@example.com',
            fechaRegistro: '2024-01-15',
            estado: 'inactivo',
            serviciosSolicitados: 0,
            ultimaActividad: '2024-01-16'
        }
    ],
    actividad: [
        { usuario: 'John Doe', accion: 'logged in', fecha: new Date() },
        { usuario: 'Jane Smith', accion: 'updated profile', fecha: new Date(Date.now() - 3600000) },
        { usuario: 'Bob Johnson', accion: 'added service', fecha: new Date(Date.now() - 7200000) },
        { usuario: 'Alice Wilson', accion: 'requested service', fecha: new Date(Date.now() - 10800000) },
        { usuario: 'Mike Brown', accion: 'completed payment', fecha: new Date(Date.now() - 14400000) }
    ]
};

// ==========================================
// FUNCIONES DE INICIALIZACIÓN
// ==========================================

/**
 * Inicializa el panel de administración
 */
function inicializarAdmin() {
    console.log('Inicializando panel de administración ServiceHub');
    
    // Verificar autenticación de administrador
    if (!verificarAutenticacionAdmin()) {
        redirigirALogin();
        return;
    }
    
    // Cargar datos iniciales
    cargarDatosAdmin();
    
    // Configurar
}