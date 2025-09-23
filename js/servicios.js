
// ==========================================
// VARIABLES GLOBALES
// ==========================================

let todosLosServicios = [];
let serviciosFiltrados = [];
let filtroActual = 'all';
let terminoBusqueda = '';
let ordenActual = 'name';
let datosUsuario = null;

// Base de datos de servicios
const serviciosDisponibles = [
    {
        id: 'web-development',
        nombre: 'Web Development',
        categoria: 'categoria1',
        precio: 500,
        descripcion: 'Build modern and responsive websites with our expert web development services.',
        imagen: 'imagen-web-dev',
        disponible: true,
        calificacion: 4.8,
        tiempoEstimado: '2-4 weeks',
        proveedor: 'Tech Solutions Team',
        caracteristicas: [
            'Responsive design',
            'SEO optimization',
            'Modern frameworks',
            'Cross-browser compatibility',
            '3 months support'
        ]
    },
    {
        id: 'graphic-design',
        nombre: 'Graphic Design',
        categoria: 'categoria1',
        precio: 300,
        descripcion: 'Get eye-catching designs crafted by our talented graphic designers.',
        imagen: 'imagen-graphic-design',
        disponible: true,
        calificacion: 4.9,
        tiempoEstimado: '1-2 weeks',
        proveedor: 'Creative Design Studio',
        caracteristicas: [
            'Custom illustrations',
            'Brand identity',
            'Print ready files',
            'Multiple revisions',
            'Vector formats'
        ]
    },
    {
        id: 'digital-marketing',
        nombre: 'Digital Marketing',
        categoria: 'categoria2',
        precio: 400,
        descripcion: 'Boost your online presence with our comprehensive digital marketing solutions.',
        imagen: 'imagen-digital-marketing',
        disponible: true,
        calificacion: 4.7,
        tiempoEstimado: 'Ongoing',
        proveedor: 'Marketing Experts',
        caracteristicas: [
            'Social media management',
            'SEO/SEM campaigns',
            'Content marketing',
            'Analytics reporting',
            'Monthly strategy reviews'
        ]
    },
    {
        id: 'premium-cleaning',
        nombre: 'Premium Cleaning',
        categoria: 'categoria2',
        precio: 125, // Precio promedio entre paquetes
        descripcion: 'Professional cleaning services with eco-friendly products and exceptional results.',
        imagen: 'imagen-cleaning',
        disponible: true,
        calificacion: 5.0,
        tiempoEstimado: '2-5 hours',
        proveedor: 'ServiceHub Cleaning Team',
        caracteristicas: [
            'Eco-friendly products',
            'Deep cleaning',
            'Flexible scheduling',
            'Satisfaction guarantee',
            'Insured team'
        ],
        paquetes: {
            estandar: { nombre: 'Standard', precio: 100 },
            premium: { nombre: 'Premium', precio: 150 }
        }
    },
    {
        id: 'home-repair',
        nombre: 'Home Repair Services',
        categoria: 'categoria2',
        precio: 200,
        descripcion: 'Professional home repair and maintenance services for all your needs.',
        imagen: 'imagen-repair',
        disponible: true,
        calificacion: 4.6,
        tiempoEstimado: '1-3 days',
        proveedor: 'HandyPro Services',
        caracteristicas: [
            'Licensed professionals',
            'Emergency repairs',
            'Quality materials',
            'Warranty included',
            'Free estimates'
        ]
    },
    {
        id: 'consulting',
        nombre: 'Business Consulting',
        categoria: 'categoria1',
        precio: 150,
        descripcion: 'Expert business consulting to help grow your company and optimize operations.',
        imagen: 'imagen-consulting',
        disponible: false, // Temporalmente no disponible
        calificacion: 4.5,
        tiempoEstimado: 'Varies',
        proveedor: 'Business Growth Partners',
        caracteristicas: [
            'Strategy development',
            'Process optimization',
            'Market analysis',
            'Performance metrics',
            'Ongoing support'
        ]
    }
];

// ==========================================
// FUNCIONES DE INICIALIZACIÓN
// ==========================================

/**
 * Inicializa la página de servicios
 */
function inicializarServicios() {
    console.log('Inicializando página de servicios');

    // Cargar datos de usuario
    cargarDatosUsuario();

    // Configurar servicios
    todosLosServicios = [...serviciosDisponibles];
    serviciosFiltrados = [...todosLosServicios];

    // Renderizar servicios iniciales
    renderizarServicios();

    // Configurar event listeners
    configurarEventListeners();

    // Configurar búsqueda en tiempo real
    configurarBusquedaTiempoReal();

    // Mostrar estadísticas iniciales
    mostrarEstadisticas();

    // Configurar animaciones
    configurarAnimaciones();

    // Verificar parámetros de URL
    procesarParametrosURL();

    console.log('Página de servicios inicializada correctamente');
}

/**
 * Configura todos los event listeners necesarios
 */
function configurarEventListeners() {
    // Campo de búsqueda
    const campoBusqueda = document.getElementById('campoBusqueda');
    if (campoBusqueda) {
        campoBusqueda.addEventListener('input', manejarBusqueda);
        campoBusqueda.addEventListener('keydown', manejarTeclasBusqueda);
    }

    // Botones de filtro
    const botonesFiltro = document.querySelectorAll('.boton-filtro');
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', function () {
            const categoria = this.textContent.toLowerCase().includes('all') ? 'all' :
                this.textContent.toLowerCase().includes('1') ? 'categoria1' : 'categoria2';
            filtrarCategoria(categoria);
        });
    });

    // Configurar scroll infinito (opcional)
    configurarScrollInfinito();

    // Atajos de teclado
    document.addEventListener('keydown', manejarAtajosTeclado);
}

// ==========================================
// FUNCIONES DE BÚSQUEDA Y FILTRADO
// ==========================================

/**
 * Maneja la búsqueda en tiempo real
 */
function manejarBusqueda() {
    const campoBusqueda = document.getElementById('campoBusqueda');
    terminoBusqueda = campoBusqueda.value.toLowerCase().trim();

    // Aplicar filtros combinados
    aplicarFiltrosCombinados();

    // Destacar términos de búsqueda
    if (terminoBusqueda) {
        destacarTerminosBusqueda();
    }
}

/**
 * Filtra servicios por categoría
 * @param {string} categoria - Categoría a filtrar
 */
function filtrarCategoria(categoria) {
    // Actualizar botón activo
    document.querySelectorAll('.boton-filtro').forEach(btn => {
        btn.classList.remove('activo');
    });

    const botonActivo = Array.from(document.querySelectorAll('.boton-filtro')).find(btn => {
        const texto = btn.textContent.toLowerCase();
        return categoria === 'all' ? texto.includes('all') :
            categoria === 'categoria1' ? texto.includes('1') :
                categoria === 'categoria2' ? texto.includes('2') : false;
    });

    if (botonActivo) {
        botonActivo.classList.add('activo');
    }

    filtroActual = categoria;
    aplicarFiltrosCombinados();
}

/**
 * Aplica todos los filtros combinados (búsqueda + categoría)
 */
function aplicarFiltrosCombinados() {
    serviciosFiltrados = todosLosServicios.filter(servicio => {
        // Filtro por categoría
        const coincideCategoria = filtroActual === 'all' || servicio.categoria === filtroActual;

        // Filtro por búsqueda
        const coincideBusqueda = !terminoBusqueda ||
            servicio.nombre.toLowerCase().includes(terminoBusqueda) ||
            servicio.descripcion.toLowerCase().includes(terminoBusqueda) ||
            servicio.proveedor.toLowerCase().includes(terminoBusqueda);

        return coincideCategoria && coincideBusqueda;
    });

    // Ordenar resultados
    ordenarServicios();

    // Renderizar resultados
    renderizarServicios();

    // Mostrar estadísticas de filtrado
    mostrarEstadisticasFiltrado();
}

/**
 * Ordena los servicios según el criterio actual
 */
function ordenarServicios() {
    serviciosFiltrados.sort((a, b) => {
        switch (ordenActual) {
            case 'price-low':
                return a.precio - b.precio;
            case 'price-high':
                return b.precio - a.precio;
            case 'rating':
                return b.calificacion - a.calificacion;
            case 'name':
            default:
                return a.nombre.localeCompare(b.nombre);
        }
    });
}

// ==========================================
// FUNCIONES DE RENDERIZADO
// ==========================================

/**
 * Renderiza la lista de servicios filtrados
 */
function renderizarServicios() {
    const gridServicios = document.getElementById('gridServicios');
    const mensajeVacio = document.getElementById('mensajeVacio');

    if (serviciosFiltrados.length === 0) {
        gridServicios.innerHTML = '';
        mensajeVacio.classList.remove('oculto');
        return;
    }

    mensajeVacio.classList.add('oculto');

    // Generar HTML de servicios
    const serviciosHTML = serviciosFiltrados.map((servicio, index) =>
        generarTarjetaServicio(servicio, index)
    ).join('');

    gridServicios.innerHTML = serviciosHTML;

    // Configurar animaciones de entrada
    animarTarjetas();

    // Configurar lazy loading de imágenes
    configurarLazyLoading();
}

function generarTarjetaServicio(servicio, index) {
    const precioTexto = servicio.paquetes ?
        `${servicio.paquetes.estandar.precio} - ${servicio.paquetes.premium.precio}` :
        `${servicio.precio}`;

    const estadoClase = servicio.disponible ? '' : 'no-disponible';
    const estadoTexto = servicio.disponible ? '' : '<div class="etiqueta-no-disponible">Temporarily Unavailable</div>';

    return `
                <div class="tarjeta-servicio-lista ${estadoClase}" 
                     data-categoria="${servicio.categoria}" 
                     data-nombre="${servicio.nombre.toLowerCase()}"
                     data-id="${servicio.id}"
                     style="animation-delay: ${index * 0.1}s">
                    
                    ${estadoTexto}
                    
                    <div class="imagen-servicio-lista ${servicio.imagen}">
                        <div class="overlay-imagen">
                            <div class="calificacion-overlay">
                                ${'⭐'.repeat(Math.floor(servicio.calificacion))} ${servicio.calificacion}
                            </div>
                            <div class="tiempo-overlay">
                                ${servicio.tiempoEstimado}
                            </div>
                        </div>
                    </div>
                    
                    <div class="contenido-tarjeta">
                        <div class="cabecera-tarjeta">
                            <h3 class="titulo-servicio-lista">${servicio.nombre}</h3>
                            <div class="proveedor-servicio">${servicio.proveedor}</div>
                        </div>
                        
                        <p class="descripcion-servicio-lista">${servicio.descripcion}</p>
                        
                        <div class="caracteristicas-servicio">
                            ${servicio.caracteristicas.slice(0, 3).map(caracteristica =>
        `<span class="caracteristica-tag">✓ ${caracteristica}</span>`
    ).join('')}
                        </div>
                        
                        <div class="info-precio">
                            <div class="precio-servicio">Price: $${precioTexto}</div>
                            ${servicio.caracteristicas.length > 3 ?
            `<div class="mas-caracteristicas">+${servicio.caracteristicas.length - 3} more</div>` :
            ''
        }
                        </div>
                        
                        <button class="boton-ver-detalles" 
                                onclick="verDetalles('${servicio.id}')"
                                ${!servicio.disponible ? 'disabled' : ''}>
                            ${servicio.disponible ? 'View Details' : 'Unavailable'}
                        </button>
                    </div>
                </div>
            `;
}

// ==========================================
// FUNCIONES DE NAVEGACIÓN
// ==========================================

function verDetalles(idServicio) {
    console.log(`Navegando a detalles del servicio: ${idServicio}`);
    const servicio = todosLosServicios.find(s => s.id === idServicio);

    if (!servicio) {
        mostrarNotificacion('Service not found', 'error');
        return;
    }

    if (!servicio.disponible) {
        mostrarNotificacion('This service is temporarily unavailable', 'advertencia');
        return;
    }

    // Guardar estado actual para navegación de regreso
    guardarEstadoNavegacion();

    // Efecto de transición
    const tarjeta = document.querySelector(`[data-id="${idServicio}"]`);
    if (tarjeta) {
        tarjeta.style.transform = 'scale(0.95)';
        tarjeta.style.opacity = '0.7';
    }

    // Navegar pasando el ID en la URL
    setTimeout(() => {
        console.log(`Navegando a página de detalles para: ${servicio.nombre}`);
        window.location.href = `servicio-detalle.html?id=${idServicio}`;
    }, 200);
}



function solicitarServicioGenerico(idServicio) {
    if (!datosUsuario) {
        mostrarNotificacion('Please log in to request services', 'advertencia');
        cerrarModalDetalle();
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    // Simular procesamiento
    mostrarNotificacion('Service request submitted! We will contact you soon.', 'exito');
    cerrarModalDetalle();
}

function contactarProveedor(idServicio) {
    const servicio = todosLosServicios.find(s => s.id === idServicio);

    const email = 'provider@servicehub.com';
    const asunto = `Inquiry about ${servicio.nombre}`;
    const cuerpo = `Hello,\n\nI'm interested in your ${servicio.nombre} service.\n\nPlease contact me with more information.\n\nThank you!`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    window.location.href = mailtoLink;

    cerrarModalDetalle();
}

// ==========================================
// FUNCIONES DE BÚSQUEDA AVANZADA
// ==========================================

/**
 * Configura búsqueda en tiempo real con debounce
 */
function configurarBusquedaTiempoReal() {
    const campoBusqueda = document.getElementById('campoBusqueda');
    let timeoutBusqueda;

    if (campoBusqueda) {
        campoBusqueda.addEventListener('input', function () {
            clearTimeout(timeoutBusqueda);

            // Mostrar indicador de búsqueda
            mostrarIndicadorBusqueda(true);

            timeoutBusqueda = setTimeout(() => {
                manejarBusqueda();
                mostrarIndicadorBusqueda(false);
            }, 300);
        });
    }
}

function mostrarIndicadorBusqueda(mostrar) {
    const campoBusqueda = document.getElementById('campoBusqueda');
    if (mostrar) {
        campoBusqueda.style.borderColor = '#3498db';
        campoBusqueda.style.boxShadow = '0 0 10px rgba(52, 152, 219, 0.3)';
    } else {
        campoBusqueda.style.borderColor = '';
        campoBusqueda.style.boxShadow = '';
    }
}

function manejarTeclasBusqueda(evento) {
    if (evento.key === 'Escape') {
        // Limpiar búsqueda
        evento.target.value = '';
        terminoBusqueda = '';
        aplicarFiltrosCombinados();
    } else if (evento.key === 'Enter') {
        // Enfocar primer resultado
        const primerBoton = document.querySelector('.boton-ver-detalles:not([disabled])');
        if (primerBoton) {
            primerBoton.click();
        }
    }
}

/**
 * Destaca términos de búsqueda en los resultados
 */
function destacarTerminosBusqueda() {
    if (!terminoBusqueda) return;

    const tarjetas = document.querySelectorAll('.tarjeta-servicio-lista');

    tarjetas.forEach(tarjeta => {
        const titulo = tarjeta.querySelector('.titulo-servicio-lista');
        const descripcion = tarjeta.querySelector('.descripcion-servicio-lista');

        [titulo, descripcion].forEach(elemento => {
            if (elemento) {
                const textoOriginal = elemento.dataset.textoOriginal || elemento.textContent;
                elemento.dataset.textoOriginal = textoOriginal;

                const regex = new RegExp(`(${terminoBusqueda})`, 'gi');
                const textoDestacado = textoOriginal.replace(regex, '<mark>$1</mark>');
                elemento.innerHTML = textoDestacado;
            }
        });
    });
}

// ==========================================
// FUNCIONES DE ESTADÍSTICAS
// ==========================================

/**
 * Muestra estadísticas generales de servicios
 */
function mostrarEstadisticas() {
    const totalServicios = todosLosServicios.length;
    const serviciosDisponibles = todosLosServicios.filter(s => s.disponible).length;
    const promedioCalificacion = (
        todosLosServicios.reduce((sum, s) => sum + s.calificacion, 0) / totalServicios
    ).toFixed(1);

    // Agregar información al DOM si hay un contenedor
    const contenedorStats = document.querySelector('.estadisticas-servicios');
    if (contenedorStats) {
        contenedorStats.innerHTML = `
            <div class="stat-item">
                <span class="stat-number">${serviciosDisponibles}</span>
                <span class="stat-label">Available Services</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${promedioCalificacion}⭐</span>
                <span class="stat-label">Average Rating</span>
            </div>
        `;
    }
}

/**
 * Muestra estadísticas de filtrado actual
 */
function mostrarEstadisticasFiltrado() {
    const totalFiltrados = serviciosFiltrados.length;
    const terminoTexto = terminoBusqueda ? ` for "${terminoBusqueda}"` : '';
    const categoriaTexto = filtroActual !== 'all' ? ` in ${filtroActual}` : '';

    console.log(`Resultados: ${totalFiltrados} servicios encontrados${terminoTexto}${categoriaTexto}`);

    // Actualizar título de sección si existe
    const tituloSeccion = document.querySelector('.titulo-resultados');
    if (tituloSeccion) {
        tituloSeccion.textContent = `${totalFiltrados} Services Found${terminoTexto}${categoriaTexto}`;
    }
}

// ==========================================
// FUNCIONES DE ANIMACIÓN
// ==========================================

/**
 * Configura animaciones generales de la página
 */
function configurarAnimaciones() {
    // Animación de entrada del título
    const titulo = document.querySelector('h1');
    if (titulo) {
        titulo.style.opacity = '0';
        titulo.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            titulo.style.transition = 'all 0.6s ease';
            titulo.style.opacity = '1';
            titulo.style.transform = 'translateY(0)';
        }, 200);
    }

    // Animación de la barra de búsqueda
    const campoBusqueda = document.getElementById('campoBusqueda');
    if (campoBusqueda) {
        campoBusqueda.style.transform = 'scale(0.9)';
        campoBusqueda.style.opacity = '0';

        setTimeout(() => {
            campoBusqueda.style.transition = 'all 0.8s ease';
            campoBusqueda.style.transform = 'scale(1)';
            campoBusqueda.style.opacity = '1';
        }, 400);
    }
}

/**
 * Anima las tarjetas de servicios al renderizar
 */
function animarTarjetas() {
    const tarjetas = document.querySelectorAll('.tarjeta-servicio-lista');

    tarjetas.forEach((tarjeta, index) => {
        tarjeta.style.opacity = '0';
        tarjeta.style.transform = 'translateY(30px)';

        setTimeout(() => {
            tarjeta.style.transition = 'all 0.6s ease';
            tarjeta.style.opacity = '1';
            tarjeta.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ==========================================
// FUNCIONES DE UTILIDAD
// ==========================================

/**
 * Carga datos del usuario desde localStorage
 */
function cargarDatosUsuario() {
    try {
        const datosGuardados = localStorage.getItem('servicehub_usuario');
        if (datosGuardados) {
            datosUsuario = JSON.parse(datosGuardados);
        }
    } catch (error) {
        console.error('Error cargando datos de usuario:', error);
    }
}

/**
 * Guarda el estado actual para navegación de regreso
 */
function guardarEstadoNavegacion() {
    const estado = {
        filtroActual,
        terminoBusqueda,
        ordenActual,
        scrollPosition: window.scrollY
    };

    sessionStorage.setItem('servicehub_estado_servicios', JSON.stringify(estado));
}

/**
 * Restaura el estado de navegación si existe
 */
function restaurarEstadoNavegacion() {
    try {
        const estadoGuardado = sessionStorage.getItem('servicehub_estado_servicios');
        if (estadoGuardado) {
            const estado = JSON.parse(estadoGuardado);

            // Restaurar filtros
            filtroActual = estado.filtroActual;
            terminoBusqueda = estado.terminoBusqueda;
            ordenActual = estado.ordenActual;

            // Restaurar UI
            document.getElementById('campoBusqueda').value = terminoBusqueda;
            filtrarCategoria(filtroActual);

            // Restaurar scroll
            setTimeout(() => {
                window.scrollTo(0, estado.scrollPosition);
            }, 100);

            // Limpiar estado guardado
            sessionStorage.removeItem('servicehub_estado_servicios');
        }
    } catch (error) {
        console.error('Error restaurando estado:', error);
    }
}

/**
 * Procesa parámetros de URL para filtrado automático
 */
function procesarParametrosURL() {
    const urlParams = new URLSearchParams(window.location.search);

    // Búsqueda desde URL
    const busquedaURL = urlParams.get('search');
    if (busquedaURL) {
        document.getElementById('campoBusqueda').value = busquedaURL;
        terminoBusqueda = busquedaURL.toLowerCase();
        aplicarFiltrosCombinados();
    }

    // Categoría desde URL
    const categoriaURL = urlParams.get('category');
    if (categoriaURL) {
        filtrarCategoria(categoriaURL);
    }

    // Orden desde URL
    const ordenURL = urlParams.get('sort');
    if (ordenURL) {
        ordenActual = ordenURL;
        aplicarFiltrosCombinados();
    }
}

/**
 * Configura scroll infinito (opcional)
 */
function configurarScrollInfinito() {
    // Implementación básica de scroll infinito
    let cargandoMas = false;

    window.addEventListener('scroll', function () {
        if (cargandoMas) return;

        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight - 200) {
            // Simular carga de más servicios
            cargarMasServicios();
        }
    });
}

/**
 * Simula carga de más servicios
 */
function cargarMasServicios() {
    // Por ahora, solo mostrar notificación
    // En una implementación real, aquí se cargarían más servicios desde una API
    console.log('Reached bottom - would load more services here');
}

/**
 * Configura lazy loading de imágenes
 */
function configurarLazyLoading() {
    const imagenes = document.querySelectorAll('.imagen-servicio-lista');

    const observerOpciones = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const imagen = entry.target;
                imagen.classList.add('cargada');
                observer.unobserve(imagen);
            }
        });
    }, observerOpciones);

    imagenes.forEach(imagen => {
        imageObserver.observe(imagen);
    });
}

function manejarAtajosTeclado(evento) {
    // Ctrl + F para enfocar búsqueda
    if (evento.ctrlKey && evento.key === 'f') {
        evento.preventDefault();
        document.getElementById('campoBusqueda').focus();
    }

    // Números 1-3 para filtros rápidos
    if (['1', '2', '3'].includes(evento.key) && !evento.ctrlKey && !evento.altKey) {
        const target = document.activeElement;
        if (target.tagName !== 'INPUT') {
            const categorias = ['all', 'categoria1', 'categoria2'];
            filtrarCategoria(categorias[parseInt(evento.key) - 1]);
        }
    }
}

function cerrarModalConEscape(evento) {
    if (evento.key === 'Escape') {
        cerrarModalDetalle();
    }
}

function mostrarNotificacion(mensaje, tipo = 'info', duracion = 3000) {
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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarServicios);

// Restaurar estado al volver a la página
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        restaurarEstadoNavegacion();
    }
});

// Exportar funciones para uso global
window.ServiciosServiceHub = {
    verDetalles,
    filtrarCategoria,
    cerrarModalDetalle,
    solicitarServicioGenerico,
    contactarProveedor
};