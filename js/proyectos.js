// proyectos.js - Funcionalidades para la página de proyectos

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const filterButtons = document.querySelectorAll('.filter-btn');
    const proyectoCards = document.querySelectorAll('.proyecto-card');
    const detallesButtons = document.querySelectorAll('.btn-detalles');
    const modal = document.getElementById('modalProyecto');
    const closeModalBtn = document.getElementById('closeModal');
    const cerrarModalBtn = document.getElementById('modalCerrar');
    const verMasBtn = document.getElementById('verMasProyectos');
    const statsNumbers = document.querySelectorAll('.stat-number');
    const proyectoGrid = document.getElementById('proyectosGrid');
    
    // Datos de proyectos (simulación de base de datos)
    const proyectosData = {
        1: {
            titulo: "Sistema de Gestión Educativa",
            categoria: "sistema",
            fecha: "2024",
            descripcion: "Plataforma integral para gestión académica con módulos de estudiantes, docentes, calificaciones y reportes automatizados. Sistema desarrollado para una institución educativa con más de 500 usuarios activos.",
            tecnologias: [
                { nombre: "Laravel", icono: "fab fa-laravel" },
                { nombre: "MySQL", icono: "fas fa-database" },
                { nombre: "Vue.js", icono: "fab fa-vuejs" },
                { nombre: "Bootstrap", icono: "fab fa-bootstrap" }
            ],
            features: [
                "Gestión de usuarios multi-rol (admin, docente, estudiante)",
                "Generación automática de boletines de calificaciones",
                "API REST para integración con sistemas externos",
                "Sistema de backup automático diario",
                "Panel de reportes estadísticos en tiempo real"
            ],
            resultados: "Reducción del 70% en tiempo de gestión administrativa. Automatización completa de procesos manuales. Mejora en la comunicación entre docentes y estudiantes.",
            enlaces: [
                { texto: "Demo en Vivo", url: "#", icono: "fas fa-external-link-alt" },
                { texto: "Repositorio GitHub", url: "#", icono: "fab fa-github" },
                { texto: "Documentación", url: "#", icono: "fas fa-book" }
            ],
            demoUrl: "#",
            codigoUrl: "#"
        },
        2: {
            titulo: "Tienda Online 'TechShop'",
            categoria: "web",
            fecha: "2024",
            descripcion: "Plataforma de comercio electrónico completa con carrito de compras, pasarela de pagos integrada y panel de administración de productos en tiempo real.",
            tecnologias: [
                { nombre: "React", icono: "fab fa-react" },
                { nombre: "Node.js", icono: "fab fa-node-js" },
                { nombre: "MongoDB", icono: "fas fa-database" },
                { nombre: "Stripe", icono: "fab fa-stripe" }
            ],
            features: [
                "Carrito de compras con persistencia de sesión",
                "Integración con Stripe para procesamiento de pagos",
                "Sistema de reseñas y calificaciones de productos",
                "Panel de administración con análisis de ventas",
                "Búsqueda avanzada con filtros múltiples"
            ],
            resultados: "Más de 1000 productos gestionados. Procesamiento seguro de transacciones. Incremento del 40% en conversiones después de implementar el sistema.",
            enlaces: [
                { texto: "Tienda Online", url: "#", icono: "fas fa-shopping-cart" },
                { texto: "Código Frontend", url: "#", icono: "fab fa-github" },
                { texto: "Código Backend", url: "#", icono: "fab fa-github" }
            ],
            demoUrl: "#",
            codigoUrl: "#"
        },
        // ... más proyectos
    };

    // ===== FILTRADO DE PROYECTOS =====
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar active al botón clickeado
            this.classList.add('active');
            
            const filterValue = this.dataset.filter;
            
            // Filtrar proyectos
            proyectoCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'flex';
                    anime({
                        targets: card,
                        opacity: [0, 1],
                        scale: [0.9, 1],
                        easing: 'easeOutExpo',
                        duration: 600,
                        delay: anime.stagger(100)
                    });
                } else {
                    const categories = card.dataset.category.split(' ');
                    
                    if (categories.includes(filterValue)) {
                        card.style.display = 'flex';
                        anime({
                            targets: card,
                            opacity: [0, 1],
                            scale: [0.9, 1],
                            easing: 'easeOutExpo',
                            duration: 600
                        });
                    } else {
                        anime({
                            targets: card,
                            opacity: [1, 0],
                            scale: [1, 0.9],
                            easing: 'easeInExpo',
                            duration: 300,
                            complete: () => {
                                card.style.display = 'none';
                            }
                        });
                    }
                }
            });
            
            // Feedback visual
            showToast(`Mostrando proyectos de: ${this.textContent.trim()}`, 'info');
        });
    });

    // ===== ANIMAR ESTADÍSTICAS =====
    function animateStats() {
        statsNumbers.forEach(stat => {
            const final = stat.dataset.count;
            let start = 0;
            const increment = final.includes('+') ? 
                parseInt(final) / 30 : 
                parseInt(final.replace('+', '')) / 30;
            const duration = 1500;
            const step = duration / (parseInt(final) / increment);
            
            const timer = setInterval(() => {
                start += increment;
                if (start >= parseInt(final)) {
                    stat.textContent = final;
                    clearInterval(timer);
                    
                    anime({
                        targets: stat,
                        scale: [1, 1.2, 1],
                        easing: 'easeInOutSine',
                        duration: 300
                    });
                } else {
                    stat.textContent = Math.floor(start) + 
                        (final.includes('+') ? '+' : '');
                }
            }, step);
        });
    }

    // ===== MODAL DE DETALLES =====
    detallesButtons.forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.dataset.project;
            const projectData = proyectosData[projectId];
            
            if (!projectData) return;
            
            // Llenar modal con datos
            document.getElementById('modalTitulo').textContent = projectData.titulo;
            document.getElementById('modalFecha').textContent = projectData.fecha;
            document.getElementById('modalDescripcion').textContent = projectData.descripcion;
            document.getElementById('modalResultados').textContent = projectData.resultados;
            
            // Configurar badge según categoría
            const modalBadge = document.getElementById('modalBadge');
            modalBadge.className = 'modal-badge';
            modalBadge.classList.add(projectData.categoria);
            
            switch(projectData.categoria) {
                case 'sistema':
                    modalBadge.innerHTML = '<i class="fas fa-desktop"></i> Sistema';
                    break;
                case 'web':
                    modalBadge.innerHTML = '<i class="fas fa-globe"></i> Web';
                    break;
                case 'mobile':
                    modalBadge.innerHTML = '<i class="fas fa-mobile-alt"></i> Móvil';
                    break;
                case 'fullstack':
                    modalBadge.innerHTML = '<i class="fas fa-code"></i> FullStack';
                    break;
            }
            
            // Tecnologías
            const modalTech = document.getElementById('modalTech');
            modalTech.innerHTML = '';
            projectData.tecnologias.forEach(tech => {
                const techElement = document.createElement('span');
                techElement.className = 'tech-tag';
                techElement.innerHTML = `<i class="${tech.icono}"></i> ${tech.nombre}`;
                modalTech.appendChild(techElement);
            });
            
            // Features
            const modalFeatures = document.getElementById('modalFeatures');
            modalFeatures.innerHTML = '';
            projectData.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                modalFeatures.appendChild(li);
            });
            
            // Enlaces
            const modalLinks = document.getElementById('modalLinks');
            modalLinks.innerHTML = '';
            projectData.enlaces.forEach(enlace => {
                const a = document.createElement('a');
                a.href = enlace.url;
                a.target = '_blank';
                a.innerHTML = `<i class="${enlace.icono}"></i> ${enlace.texto}`;
                modalLinks.appendChild(a);
            });
            
            // Botones del modal
            document.getElementById('modalDemo').href = projectData.demoUrl;
            document.getElementById('modalCodigo').href = projectData.codigoUrl;
            
            // Mostrar modal
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Animación de entrada
            anime({
                targets: '.modal-content',
                opacity: [0, 1],
                scale: [0.9, 1],
                easing: 'easeOutExpo',
                duration: 400
            });
        });
    });

    // ===== CERRAR MODAL =====
    function closeModal() {
        anime({
            targets: '.modal-content',
            opacity: [1, 0],
            scale: [1, 0.9],
            easing: 'easeInExpo',
            duration: 300,
            complete: () => {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    closeModalBtn.addEventListener('click', closeModal);
    cerrarModalBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ===== BOTÓN VER MÁS =====
    verMasBtn.addEventListener('click', function() {
        // Simular carga de más proyectos
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
        this.disabled = true;
        
        setTimeout(() => {
            // Proyectos adicionales (simulación)
            const proyectosAdicionales = [
                {
                    categoria: "web",
                    fecha: "2023",
                    titulo: "Blog Técnico con CMS Personalizado",
                    descripcion: "Sistema de gestión de contenido desarrollado desde cero con editor en tiempo real y categorización avanzada.",
                    badge: "web",
                    tech: "Node.js, React, MongoDB"
                },
                {
                    categoria: "sistema",
                    fecha: "2023",
                    titulo: "Sistema de Reservas para Restaurante",
                    descripcion: "Plataforma para gestión de reservas en línea con confirmación automática y recordatorios por WhatsApp.",
                    badge: "sistema",
                    tech: "PHP, MySQL, WhatsApp API"
                }
            ];
            
            // Crear y añadir nuevas tarjetas
            proyectosAdicionales.forEach((proyecto, index) => {
                const nuevaTarjeta = crearTarjetaProyecto(proyecto, index + 7);
                proyectoGrid.appendChild(nuevaTarjeta);
                
                // Animación de entrada
                anime({
                    targets: nuevaTarjeta,
                    opacity: [0, 1],
                    translateY: [50, 0],
                    easing: 'easeOutExpo',
                    duration: 600,
                    delay: index * 200
                });
            });
            
            // Restaurar botón
            this.innerHTML = '<i class="fas fa-plus"></i> Ver Más Proyectos';
            this.disabled = false;
            
            // Ocultar botón si ya hay muchos proyectos
            if (proyectoGrid.children.length >= 10) {
                this.style.display = 'none';
            }
            
            showToast('Proyectos adicionales cargados', 'success');
        }, 1500);
    });

    // ===== FUNCIÓN PARA CREAR TARJETA =====
    function crearTarjetaProyecto(proyecto, id) {
        const card = document.createElement('div');
        card.className = 'proyecto-card';
        card.dataset.category = proyecto.categoria;
        card.dataset.project = id;
        
        let badgeClass = '';
        let badgeIcon = '';
        let badgeText = '';
        
        switch(proyecto.badge) {
            case 'sistema':
                badgeClass = 'sistema';
                badgeIcon = 'fas fa-desktop';
                badgeText = 'Sistema';
                break;
            case 'web':
                badgeClass = 'web';
                badgeIcon = 'fas fa-globe';
                badgeText = 'Web';
                break;
            case 'mobile':
                badgeClass = 'mobile';
                badgeIcon = 'fas fa-mobile-alt';
                badgeText = 'Móvil';
                break;
            default:
                badgeClass = 'fullstack';
                badgeIcon = 'fas fa-code';
                badgeText = 'FullStack';
        }
        
        card.innerHTML = `
            <div class="proyecto-header">
                <div class="proyecto-badge ${badgeClass}">
                    <i class="${badgeIcon}"></i> ${badgeText}
                </div>
                <div class="proyecto-fecha">${proyecto.fecha}</div>
            </div>
            
            <div class="proyecto-content">
                <h3 class="proyecto-titulo">${proyecto.titulo}</h3>
                <p class="proyecto-descripcion">${proyecto.descripcion}</p>
                
                <div class="proyecto-tech">
                    <span class="tech-tag"><i class="fas fa-code"></i> ${proyecto.tech}</span>
                </div>
                
                <div class="proyecto-features">
                    <div class="feature">
                        <i class="fas fa-check-circle"></i>
                        <span>Desarrollo personalizado</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-check-circle"></i>
                        <span>Optimizado para rendimiento</span>
                    </div>
                </div>
            </div>
            
            <div class="proyecto-footer">
                <button class="btn-detalles" data-project="${id}">
                    <i class="fas fa-eye"></i> Ver Detalles
                </button>
                <a href="#" class="btn-demo" target="_blank">
                    <i class="fas fa-external-link-alt"></i> Demo
                </a>
            </div>
        `;
        
        // Añadir event listener al nuevo botón de detalles
        const btnDetalles = card.querySelector('.btn-detalles');
        btnDetalles.addEventListener('click', function() {
            // Aquí podrías cargar datos específicos para este proyecto
            showToast('Funcionalidad en desarrollo', 'info');
        });
        
        return card;
    }

    // ===== TOAST NOTIFICATIONS =====
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        anime({
            targets: toast,
            translateX: [100, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 300
        });
        
        setTimeout(() => {
            anime({
                targets: toast,
                translateX: [0, 100],
                opacity: [1, 0],
                easing: 'easeInExpo',
                duration: 300,
                complete: () => toast.remove()
            });
        }, 4000);
    }
    
    function getToastIcon(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }

    // ===== INICIALIZAR ANIMACIONES =====
    function initAnimations() {
        // Animar tarjetas al cargar
        anime({
            targets: '.proyecto-card',
            opacity: [0, 1],
            translateY: [30, 0],
            easing: 'easeOutExpo',
            duration: 800,
            delay: anime.stagger(100)
        });
        
        // Animar estadísticas
        animateStats();
        
        // Animación de filtros
        anime({
            targets: '.filter-btn',
            opacity: [0, 1],
            translateX: [-20, 0],
            easing: 'easeOutExpo',
            duration: 600,
            delay: anime.stagger(100)
        });
    }

    // ===== INICIALIZAR TODO =====
    initAnimations();
    
    // Actualizar event listeners después de añadir nuevas tarjetas
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn-detalles') || e.target.closest('.btn-detalles')) {
            const button = e.target.matches('.btn-detalles') ? e.target : e.target.closest('.btn-detalles');
            const projectId = button.dataset.project;
            
            if (projectId > 6) {
                // Para proyectos nuevos, mostrar mensaje
                showToast('Detalles del proyecto en desarrollo', 'info');
                return;
            }
        }
    });

    // ===== SCROLL ANIMATIONS =====
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar-futurista');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});