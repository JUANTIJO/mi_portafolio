// index.js - Funcionalidades específicas para el index futurista

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const typedTitle = document.getElementById('typedTitle');
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    const statsNumbers = document.querySelectorAll('.stat-number');
    const contactoRapidoForm = document.getElementById('contactoRapido');
    const copyButtons = document.querySelectorAll('.btn-copy');
    const mapButtons = document.querySelectorAll('.btn-map, #openMap');
    const closeMapBtn = document.getElementById('closeMap');
    const mapModal = document.getElementById('mapModal');
    const toggleParticles = document.getElementById('toggleParticles');
    const toastContainer = document.getElementById('toastContainer');
    const floatingIcons = document.querySelectorAll('.floating-icon');
    
    // ===== TYPING EFFECT =====
    function initTypingEffect() {
        const texts = [
            "Juan Luis Tijo Osco",
            "Desarrollador Web",
            "Técnico en Sistemas",
            "Docente TIC",
            "Innovador Digital"
        ];
        
        let currentText = 0;
        let currentChar = 0;
        let isDeleting = false;
        let isEnd = false;
        
        function type() {
            const text = texts[currentText];
            
            if (isDeleting) {
                typedTitle.textContent = text.substring(0, currentChar - 1);
                currentChar--;
            } else {
                typedTitle.textContent = text.substring(0, currentChar + 1);
                currentChar++;
            }
            
            if (!isDeleting && currentChar === text.length) {
                isEnd = true;
                setTimeout(() => {
                    isDeleting = true;
                    type();
                }, 2000);
            } else if (isDeleting && currentChar === 0) {
                isDeleting = false;
                currentText = (currentText + 1) % texts.length;
                setTimeout(() => type(), 500);
            } else {
                const speed = isDeleting ? 50 : isEnd ? 100 : 150;
                setTimeout(() => type(), speed);
            }
        }
        
        type();
    }
    
    // ===== ANIMAR BARRAS DE HABILIDADES =====
    function animateSkillBars() {
        skillProgressBars.forEach(bar => {
            const width = bar.dataset.width;
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = width + '%';
                
                // Efecto de progreso
                anime({
                    targets: bar,
                    width: width + '%',
                    easing: 'easeOutExpo',
                    duration: 1500,
                    delay: anime.stagger(100)
                });
            }, 500);
        });
    }
    
    // ===== ANIMAR ESTADÍSTICAS =====
    function animateStats() {
        statsNumbers.forEach(stat => {
            const final = stat.dataset.count;
            let start = 0;
            const increment = final.includes('%') ? 
                parseInt(final) / 50 : 
                parseInt(final.replace('+', '')) / 50;
            const duration = 2000;
            const step = duration / (parseInt(final) / increment);
            
            const timer = setInterval(() => {
                start += increment;
                if (start >= parseInt(final)) {
                    stat.textContent = final;
                    clearInterval(timer);
                    
                    // Efecto final
                    anime({
                        targets: stat,
                        scale: [1, 1.2, 1],
                        easing: 'easeInOutSine',
                        duration: 300
                    });
                } else {
                    stat.textContent = Math.floor(start) + 
                        (final.includes('%') ? '%' : final.includes('+') ? '+' : '');
                }
            }, step);
        });
    }
    
    // ===== FORMULARIO DE CONTACTO RÁPIDO =====
    if (contactoRapidoForm) {
        contactoRapidoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validación simple
            if (!data.nombre || !data.email || !data.mensaje) {
                showToast('Por favor completa todos los campos', 'error');
                return;
            }
            
            if (!isValidEmail(data.email)) {
                showToast('Por favor ingresa un email válido', 'error');
                return;
            }
            
            // Simular envío
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Éxito
                showToast('¡Mensaje enviado! Te contactaré pronto', 'success');
                
                // Resetear formulario
                this.reset();
                
                // Restaurar botón
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Guardar en localStorage para demo
                const contactos = JSON.parse(localStorage.getItem('contactosRapidos') || '[]');
                contactos.push({
                    ...data,
                    fecha: new Date().toISOString()
                });
                localStorage.setItem('contactosRapidos', JSON.stringify(contactos));
                
            }, 1500);
        });
    }
    
    // ===== BOTONES COPIAR =====
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.dataset.text;
            
            navigator.clipboard.writeText(text)
                .then(() => {
                    // Feedback visual
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
                    this.style.background = 'var(--future-success)';
                    this.style.borderColor = 'var(--future-success)';
                    
                    showToast('Texto copiado al portapapeles', 'success');
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.background = '';
                        this.style.borderColor = '';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Error al copiar: ', err);
                    showToast('Error al copiar', 'error');
                });
        });
    });
    
    // ===== MODAL DEL MAPA =====
    mapButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            mapModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    closeMapBtn.addEventListener('click', () => {
        mapModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    mapModal.addEventListener('click', (e) => {
        if (e.target === mapModal) {
            mapModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // ===== ICONOS FLOTANTES INTERACTIVOS =====
    floatingIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const tooltip = this.dataset.tooltip;
            
            // Efecto de click
            anime({
                targets: this,
                scale: [1, 1.3, 1],
                rotate: [0, 360],
                easing: 'easeInOutBack',
                duration: 600
            });
            
            // Mostrar tooltip
            if (tooltip) {
                showToast(`Habilidad: ${tooltip}`, 'info');
            }
        });
    });
    
    // ===== TOGGLE PARTÍCULAS =====
    if (toggleParticles) {
        let particlesActive = true;
        
        toggleParticles.addEventListener('click', () => {
            particlesActive = !particlesActive;
            const canvas = document.getElementById('particlesCanvas');
            
            if (canvas) {
                canvas.style.opacity = particlesActive ? '1' : '0';
            }
            
            // Cambiar ícono
            const icon = toggleParticles.querySelector('i');
            if (particlesActive) {
                icon.className = 'fas fa-magic';
                toggleParticles.innerHTML = '<i class="fas fa-magic"></i> Efectos ON';
                showToast('Efectos activados', 'success');
            } else {
                icon.className = 'fas fa-eye-slash';
                toggleParticles.innerHTML = '<i class="fas fa-eye-slash"></i> Efectos OFF';
                showToast('Efectos desactivados', 'warning');
            }
        });
    }
    
    // ===== SCROLL ANIMATIONS =====
    function initScrollAnimations() {
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar-futurista');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Observer para animaciones al hacer scroll
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animar barras de habilidades
                    if (entry.target.classList.contains('sobre-mi-futurista')) {
                        animateSkillBars();
                    }
                    
                    // Animar estadísticas
                    if (entry.target.classList.contains('hero-futurista')) {
                        animateStats();
                    }
                    
                    // Agregar clase de animación
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        // Observar secciones
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    // ===== TOAST NOTIFICATIONS =====
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Animación de entrada
        anime({
            targets: toast,
            translateX: [100, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 300
        });
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            anime({
                targets: toast,
                translateX: [0, 100],
                opacity: [1, 0],
                easing: 'easeInExpo',
                duration: 300,
                complete: () => toast.remove()
            });
        }, 5000);
    }
    
    function getToastIcon(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }
    
    // ===== FUNCIONES AUXILIARES =====
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // ===== INICIALIZAR TODO =====
    initTypingEffect();
    initScrollAnimations();
    
    
    // Inicializar sistema de partículas (si existe)
    if (typeof initParticles === 'function') {
        initParticles();
    }
});

// Función para partículas (compatible con contacto.js)
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 100;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.5 + 0.1})`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;
            
            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function init() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar conexiones
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 217, 255, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        // Actualizar y dibujar partículas
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    init();
    animateParticles();
    
    // Redimensionar canvas
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}