// blog.js - Versión rediseñada con estética masculina

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const filterTabs = document.querySelectorAll('.filter-tab');
    const articulosGrid = document.getElementById('articulosGrid');
    const blogSearch = document.getElementById('blogSearch');
    const toggleTheme = document.getElementById('toggleTheme');
    const cargarMasBtn = document.getElementById('cargarMas');
    const newsletterForm = document.querySelector('.newsletter-form');
    const categoriaLinks = document.querySelectorAll('.categorias-list a');
    
    // Estado
    let temaOscuro = true;
    let filtroActual = 'todos';
    let articulosCargados = 6;
    const totalArticulos = 12;
    
    // ===== FILTRADO POR CATEGORÍA =====
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Actualizar tab activo
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            filtroActual = this.dataset.filter;
            filtrarArticulos(filtroActual);
        });
    });
    
    categoriaLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const categoria = this.dataset.categoria;
            
            // Actualizar filtros
            filterTabs.forEach(tab => {
                tab.classList.remove('active');
                if (tab.dataset.filter === categoria) {
                    tab.classList.add('active');
                }
            });
            
            filtroActual = categoria;
            filtrarArticulos(categoria);
            
            // Scroll suave a artículos
            document.querySelector('.articulos-grid-masculino').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
    
    function filtrarArticulos(categoria) {
        const articulos = document.querySelectorAll('.articulo-card, .articulo-destacado-masculino');
        let contador = 0;
        
        articulos.forEach((articulo, index) => {
            const categoriasArticulo = articulo.dataset.categoria.split(',');
            
            if (categoria === 'todos' || categoriasArticulo.includes(categoria)) {
                articulo.style.display = 'block';
                contador++;
                
                // Animación de aparición
                articulo.style.animation = 'none';
                void articulo.offsetWidth;
                articulo.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s forwards`;
            } else {
                articulo.style.display = 'none';
            }
        });
        
        // Actualizar contador
        if (cargarMasBtn) {
            const texto = contador >= totalArticulos ? 
                'Todos los artículos cargados' : 
                `Mostrando ${contador} de ${totalArticulos} artículos`;
            
            cargarMasBtn.querySelector('span').textContent = 
                contador >= totalArticulos ? 'Todos los artículos cargados' : 'Cargar más artículos';
            
            if (contador >= totalArticulos) {
                cargarMasBtn.style.display = 'none';
            }
        }
    }
    
    // ===== BÚSQUEDA EN TIEMPO REAL =====
    if (blogSearch) {
        blogSearch.addEventListener('input', function() {
            const termino = this.value.toLowerCase().trim();
            const articulos = document.querySelectorAll('.articulo-card, .articulo-destacado-masculino');
            
            articulos.forEach(articulo => {
                const titulo = articulo.querySelector('.card-titulo, .articulo-titulo').textContent.toLowerCase();
                const resumen = articulo.querySelector('.card-resumen, .articulo-resumen').textContent.toLowerCase();
                
                if (titulo.includes(termino) || resumen.includes(termino)) {
                    articulo.style.display = 'block';
                } else {
                    articulo.style.display = 'none';
                }
            });
        });
    }
    
    // ===== TOGGLE TEMA OSCURO/CLARO =====
    if (toggleTheme) {
        toggleTheme.addEventListener('click', function() {
            temaOscuro = !temaOscuro;
            
            if (temaOscuro) {
                document.body.classList.remove('tema-claro');
                document.body.classList.add('tema-oscuro');
                this.style.background = 'var(--masculine-accent)';
                this.querySelector('.fa-moon').style.opacity = '0';
                this.querySelector('.fa-moon').style.transform = 'translate(-50%, -50%) rotate(90deg)';
                this.querySelector('.fa-sun').style.opacity = '1';
                this.querySelector('.fa-sun').style.transform = 'translate(-50%, -50%)';
            } else {
                document.body.classList.remove('tema-oscuro');
                document.body.classList.add('tema-claro');
                this.style.background = 'rgba(255, 255, 255, 0.2)';
                this.querySelector('.fa-moon').style.opacity = '1';
                this.querySelector('.fa-moon').style.transform = 'translate(-50%, -50%)';
                this.querySelector('.fa-sun').style.opacity = '0';
                this.querySelector('.fa-sun').style.transform = 'translate(-50%, 50%)';
            }
        });
    }
    
    // ===== CARGAR MÁS ARTÍCULOS =====
    if (cargarMasBtn) {
        cargarMasBtn.addEventListener('click', function() {
            // Simular carga de más artículos
            const btn = this;
            const textoOriginal = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
            btn.disabled = true;
            
            setTimeout(() => {
                // En una implementación real, aquí cargarías más artículos del servidor
                articulosCargados += 3;
                
                if (articulosCargados >= totalArticulos) {
                    btn.innerHTML = '<i class="fas fa-check"></i> Todos los artículos cargados';
                    btn.disabled = true;
                    btn.style.opacity = '0.7';
                } else {
                    btn.innerHTML = textoOriginal;
                    btn.disabled = false;
                    
                    // Simular nuevos artículos
                    mostrarNotificacion(`${3} nuevos artículos cargados`, 'success');
                }
            }, 1500);
        });
    }
    
    // ===== NEWSLETTER =====
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (!isValidEmail(email)) {
                mostrarNotificacion('Por favor ingresa un email válido', 'error');
                return;
            }
            
            const btn = this.querySelector('button');
            const textoOriginal = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;
            
            // Simular suscripción
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> ¡Suscrito!';
                mostrarNotificacion('¡Gracias por suscribirte al newsletter!', 'success');
                
                // Guardar en localStorage
                const suscriptores = JSON.parse(localStorage.getItem('newsletterSuscriptores') || '[]');
                suscriptores.push({
                    email: email,
                    fecha: new Date().toISOString()
                });
                localStorage.setItem('newsletterSuscriptores', JSON.stringify(suscriptores));
                
                // Resetear formulario
                setTimeout(() => {
                    this.reset();
                    btn.innerHTML = textoOriginal;
                    btn.disabled = false;
                }, 2000);
            }, 2000);
        });
    }
    
    // ===== ANIMAR ESTADÍSTICAS =====
    function animarEstadisticas() {
        const stats = document.querySelectorAll('.blog-stats .stat-number');
        
        stats.forEach(stat => {
            const final = stat.dataset.count;
            let start = 0;
            const increment = parseInt(final) / 50;
            const duration = 2000;
            const step = duration / (parseInt(final) / increment);
            
            const timer = setInterval(() => {
                start += increment;
                if (start >= parseInt(final)) {
                    stat.textContent = final;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(start);
                }
            }, step);
        });
    }
    
    // Observar cuando las estadísticas son visibles
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animarEstadisticas();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.blog-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // ===== ANIMACIONES AL SCROLL =====
    function initScrollAnimations() {
        const articulosObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    articulosObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        // Observar artículos
        const articulos = document.querySelectorAll('.articulo-card, .articulo-destacado-masculino');
        articulos.forEach(articulo => {
            articulo.style.opacity = '0';
            articulo.style.transform = 'translateY(20px)';
            articulo.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            articulosObserver.observe(articulo);
        });
        
        // Efecto parallax en hero
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.blog-hero-masculino');
            
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.05}px)`;
            }
            
            // Efecto en líneas de código
            const codeLines = document.querySelectorAll('.code-line-float');
            codeLines.forEach((line, index) => {
                const speed = 0.02 * (index + 1);
                line.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    // ===== FUNCIONES AUXILIARES =====
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function mostrarNotificacion(mensaje, tipo = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification-${tipo}`;
        notification.textContent = mensaje;
        
        // Estilos
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 25px';
        notification.style.background = tipo === 'success' ? 'var(--masculine-accent)' : 
                                       tipo === 'error' ? '#ff4444' : 
                                       '#2196f3';
        notification.style.color = 'white';
        notification.style.borderRadius = 'var(--radius-tech)';
        notification.style.boxShadow = 'var(--shadow-tech)';
        notification.style.zIndex = '10000';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'transform 0.3s ease';
        
        document.body.appendChild(notification);
        
        // Mostrar
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Ocultar después de 4 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
    
    // ===== INICIALIZAR =====
    initScrollAnimations();
    
    // Mostrar notificación de bienvenida
    setTimeout(() => {
        mostrarNotificacion('¡Bienvenido al Tech & Code Blog!', 'info');
    }, 1000);
    
    // Inicializar animaciones de artículos
    const articulos = document.querySelectorAll('.articulo-card');
    articulos.forEach((articulo, index) => {
        articulo.style.animationDelay = `${index * 0.1}s`;
    });
});

// Estilos para tema claro
const styleTemaClaro = document.createElement('style');
styleTemaClaro.textContent = `
    .tema-claro {
        --masculine-dark: #f5f7fa;
        --masculine-primary: #ffffff;
        --masculine-secondary: #e4e7eb;
        --masculine-light: #1a1a1a;
        --masculine-text: #333333;
        --masculine-gray: #666666;
        
        --gradient-card: linear-gradient(145deg, #ffffff, #f0f2f5);
        --gradient-dark: linear-gradient(135deg, #f5f7fa, #e4e7eb);
        
        --shadow-tech: 0 10px 30px rgba(0, 0, 0, 0.1);
        --shadow-card: 0 8px 25px rgba(0, 0, 0, 0.08);
        --shadow-hover: 0 15px 35px rgba(0, 173, 181, 0.15);
    }
    
    .tema-claro .navbar-blog-masculino {
        background: white;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .tema-claro .nav-links a {
        color: rgba(0, 0, 0, 0.7);
    }
    
    .tema-claro .nav-links a:hover,
    .tema-claro .nav-links a.active {
        color: var(--masculine-accent);
    }
    
    .tema-claro .code-terminal {
        background: white;
        border: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .tema-claro .terminal-header {
        background: #f0f2f5;
    }
    
    .tema-claro .command {
        color: #333333;
    }
    
    .tema-claro .output {
        color: rgba(0, 0, 0, 0.7);
    }
`;

document.head.appendChild(styleTemaClaro);