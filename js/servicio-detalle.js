// ==========================================
// VARIABLES GLOBALES
// ==========================================

let servicioActual = null;
let paqueteSeleccionado = 'estandar';
let datosUsuario = null;
let historialSolicitudes = [];

// Base de datos completa de servicios (copiada desde servicios.js)
const todosLosServicios = [
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
        nombre: 'Premium Cleaning Service',
        categoria: 'categoria2',
        precio: 125,
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
            estandar: { nombre: 'Standard Package', precio: 100, descripcion: 'Basic cleaning service including all common areas', duracion: '2-3 hours', incluye: ['General cleaning of all rooms', 'Bathroom sanitization', 'Kitchen cleaning', 'Floor cleaning', 'Basic dusting'] },
            premium: { nombre: 'Premium Package', precio: 150, descripcion: 'Complete deep cleaning service with premium products', duracion: '4-5 hours', incluye: ['All Standard Package services', 'Deep carpet cleaning', 'Window cleaning (inside)', 'Appliance deep clean', 'Eco-friendly premium products', '30-day satisfaction guarantee'] }
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
        disponible: false,
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

function cargarServicioDesdeURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const idServicio = urlParams.get('id');
    
    console.log('ID del servicio desde URL:', idServicio);
    
    if (idServicio) {
        const servicio = todosLosServicios.find(s => s.id === idServicio);
        
        if (servicio) {
            servicioActual = servicio;
            console.log('Servicio encontrado:', servicio.nombre);
            
            // Adaptar servicios sin paquetes
            adaptarServicioSinPaquetes();
            
            // Actualizar interfaz
            actualizarInterfazServicio();
            
            return true;
        }
    }
    
    console.log('Usando servicio por defecto');
    return false;
}

function adaptarServicioSinPaquetes() {
    if (!servicioActual.paquetes) {
        const precioBase = servicioActual.precio;
        
        servicioActual.paquetes = {
            estandar: {
                nombre: 'Standard Package',
                precio: precioBase,
                descripcion: `Standard ${servicioActual.nombre} service`,
                duracion: servicioActual.tiempoEstimado || '2-4 hours',
                incluye: servicioActual.caracteristicas?.slice(0, 3) || [
                    'Professional service',
                    'Quality guarantee',
                    'Expert consultation'
                ]
            },
            premium: {
                nombre: 'Premium Package',
                precio: Math.round(precioBase * 1.5),
                descripcion: `Enhanced ${servicioActual.nombre} with premium features`,
                duracion: servicioActual.tiempoEstimado || '4-6 hours',
                incluye: [
                    ...(servicioActual.caracteristicas || [
                        'Professional service',
                        'Quality guarantee',
                        'Expert consultation'
                    ]),
                    'Priority support',
                    'Extended warranty'
                ]
            }
        };
    }
    
    // Generar reseñas si no existen
    if (!servicioActual.resenas || servicioActual.resenas.length === 0) {
        servicioActual.resenas = [
            { id: 1, autor: 'John Smith', texto: 'Great service! Very professional and reliable.', calificacion: 5, fecha: '2024-01-15' },
            { id: 2, autor: 'Mary Johnson', texto: 'Excellent quality and great customer service.', calificacion: 5, fecha: '2024-01-10' },
            { id: 3, autor: 'David Wilson', texto: 'Highly recommended! Worth every penny.', calificacion: 4, fecha: '2024-01-05' }
        ];
    }
    
    if (!servicioActual.tiempoRespuesta) {
        servicioActual.tiempoRespuesta = '24-48 hours';
    }
}

function actualizarInterfazServicio() {
    // Actualizar título
    const titulo = document.querySelector('.titulo-servicio-detalle');
    if (titulo) {
        titulo.textContent = servicioActual.nombre;
    }
    
    // Actualizar descripción
    const descripcion = document.querySelector('.descripcion-detallada');
    if (descripcion) {
        descripcion.textContent = servicioActual.descripcion;
    }
    
    // Actualizar imagen
    const imagenServicio = document.querySelector('.imagen-servicio-grande');
    if (imagenServicio && servicioActual.imagen) {
        imagenServicio.classList.add(servicioActual.imagen);
    }
    
    // Actualizar precios
    actualizarPreciosPaquetes();
    
    // Actualizar reseñas
    actualizarResenas();
    
    // Actualizar título de página
    document.title = `${servicioActual.nombre} - ServiceHub`;
}

function actualizarPreciosPaquetes() {
    const precioEstandar = document.querySelector('label[for="estandar"] + .precio-paquete');
    const precioPremium = document.querySelector('label[for="premium"] + .precio-paquete');
    
    if (precioEstandar && servicioActual.paquetes.estandar) {
        precioEstandar.textContent = `$${servicioActual.paquetes.estandar.precio}`;
    }
    
    if (precioPremium && servicioActual.paquetes.premium) {
        precioPremium.textContent = `$${servicioActual.paquetes.premium.precio}`;
    }
    
    const labelEstandar = document.querySelector('label[for="estandar"]');
    const labelPremium = document.querySelector('label[for="premium"]');
    
    if (labelEstandar && servicioActual.paquetes.estandar) {
        labelEstandar.textContent = servicioActual.paquetes.estandar.nombre;
    }
    
    if (labelPremium && servicioActual.paquetes.premium) {
        labelPremium.textContent = servicioActual.paquetes.premium.nombre;
    }
}

function actualizarResenas() {
    const contenedorResenas = document.querySelector('.lista-resenas');
    if (!contenedorResenas || !servicioActual.resenas) return;
    
    const resenaHTML = servicioActual.resenas.map(resena => `
        <div class="resena">
            <p class="texto-resena">"${resena.texto}"</p>
            <p class="autor-resena">- ${resena.autor}</p>
        </div>
    `).join('');
    
    contenedorResenas.innerHTML = resenaHTML;
    
    // Reconfigurar event listeners
    const nuevasResenas = contenedorResenas.querySelectorAll('.resena');
    nuevasResenas.forEach(resena => {
        resena.addEventListener('mouseenter', mostrarDetallesResena);
        resena.addEventListener('mouseleave', ocultarDetallesResena);
    });
}

function inicializarDetalleServicio() {
    
    // Cargar datos del usuario
    cargarDatosUsuario();
    
    // Cargar el servicio desde URL
    const servicioEncontrado = cargarServicioDesdeURL();
    
    if (!servicioEncontrado) {
        // Usar servicio por defecto si no se encuentra
        servicioActual = todosLosServicios.find(s => s.id === 'premium-cleaning');
        adaptarServicioSinPaquetes();
        actualizarInterfazServicio();
    }
    
    // Configurar listeners
    configurarEventListeners();
    
    // Mostrar información del paquete
    if (servicioActual && servicioActual.paquetes) {
        mostrarDetallesPaquete();
    }
    
    // Cargar historial
    cargarHistorialSolicitudes();
    
    // Configurar animaciones
    configurarAnimacionesDetalles();
    
    console.log('Página inicializada con servicio:', servicioActual);
}

// ==========================================
// FUNCIONES RESTANTES
// ==========================================

function configurarEventListeners() {
    const radiosPaquetes = document.querySelectorAll('input[name="paquete"]');
    radiosPaquetes.forEach(radio => {
        radio.addEventListener('change', manejarCambioPaquete);
    });
    
    const resenas = document.querySelectorAll('.resena');
    resenas.forEach(resena => {
        resena.addEventListener('mouseenter', mostrarDetallesResena);
        resena.addEventListener('mouseleave', ocultarDetallesResena);
    });
    
    document.addEventListener('keydown', manejarTeclasAtajo);
}

function manejarCambioPaquete(evento) {
    paqueteSeleccionado = evento.target.value;
    
    document.querySelectorAll('.opcion-precio').forEach(opcion => {
        opcion.classList.remove('seleccionada');
    });
    evento.target.closest('.opcion-precio').classList.add('seleccionada');
    
    mostrarDetallesPaquete();
    
    const seccionPrecios = document.querySelector('.seccion-precios');
    seccionPrecios.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
        seccionPrecios.style.transform = 'scale(1)';
    }, 150);
}

function mostrarDetallesPaquete() {
    if (!servicioActual.paquetes || !servicioActual.paquetes[paqueteSeleccionado]) {
        return;
    }
    
    const paquete = servicioActual.paquetes[paqueteSeleccionado];
    
    let tooltip = document.querySelector('.tooltip-paquete');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'tooltip-paquete';
        document.body.appendChild(tooltip);
    }
    
    const contenido = `
        <h4>${paquete.nombre}</h4>
        <p class="precio-tooltip">$${paquete.precio}</p>
        <p class="descripcion-tooltip">${paquete.descripcion}</p>
        <div class="duracion-tooltip">
            <strong>Duration:</strong> ${paquete.duracion}
        </div>
        <div class="incluye-tooltip">
            <strong>Includes:</strong>
            <ul>
                ${paquete.incluye.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `;
    
    tooltip.innerHTML = contenido;
    
    tooltip.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: white;
        padding: 1.5rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        max-width: 300px;
        z-index: 1000;
        transform: translateY(100%);
        transition: transform 0.3s ease;
        border-left: 4px solid #3498db;
    `;
    
    setTimeout(() => {
        tooltip.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        if (tooltip.parentNode) {
            tooltip.style.transform = 'translateY(100%)';
            setTimeout(() => tooltip.remove(), 300);
        }
    }, 5000);
}

function solicitarServicio() {
    console.log('Solicitando servicio...');
    mostrarNotificacion('Service request functionality coming soon!', 'info');
}

function mostrarDetallesResena(evento) {
    // Función básica para mostrar detalles de reseña
    console.log('Mostrando detalles de reseña');
}

function ocultarDetallesResena(evento) {
    // Función básica para ocultar detalles de reseña
    console.log('Ocultando detalles de reseña');
}

function cargarDatosUsuario() {
    try {
        const datosGuardados = localStorage.getItem('servicehub_usuario');
        if (datosGuardados) {
            datosUsuario = JSON.parse(datosGuardados);
            console.log('Usuario cargado:', datosUsuario.nombre);
        }
    } catch (error) {
        console.error('Error cargando datos de usuario:', error);
    }
}

function cargarHistorialSolicitudes() {
    console.log('Cargando historial de solicitudes...');
}

function configurarAnimacionesDetalles() {
    const imagenServicio = document.querySelector('.imagen-servicio-grande');
    if (imagenServicio) {
        imagenServicio.style.transform = 'scale(0.8)';
        imagenServicio.style.opacity = '0';
        
        setTimeout(() => {
            imagenServicio.style.transition = 'all 0.8s ease';
            imagenServicio.style.transform = 'scale(1)';
            imagenServicio.style.opacity = '1';
        }, 200);
    }
}

function manejarTeclasAtajo(evento) {
    if (evento.ctrlKey && evento.key === 's') {
        evento.preventDefault();
        solicitarServicio();
    }
}

function mostrarNotificacion(mensaje, tipo = 'info', duracion = 3000) {
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

document.addEventListener('DOMContentLoaded', inicializarDetalleServicio);

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        inicializarDetalleServicio();
    }
});