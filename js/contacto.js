// contacto.js - Funcionalidades avanzadas para el formulario de contacto

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const contactForm = document.getElementById('contactForm');
    const formSteps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const progressFill = document.getElementById('progressFill');
    const steps = document.querySelectorAll('.step');
    const charCount = document.getElementById('charCount');
    const messageTextarea = document.getElementById('mensaje');
    const projectTypeOptions = document.querySelectorAll('.type-option');
    const budgetOptions = document.querySelectorAll('.budget-option');
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const fileList = document.getElementById('fileList');
    const toggleParticles = document.getElementById('toggleParticles');
    const copyBtns = document.querySelectorAll('.copy-btn');
    const openMapBtn = document.getElementById('openMap');
    const closeMapBtn = document.getElementById('closeMap');
    const mapModal = document.getElementById('mapModal');
    const faqQuestions = document.querySelectorAll('.faq-question');
    const scrollToFormBtn = document.getElementById('scrollToForm');
    const formStatus = document.getElementById('formStatus');
    const resetFormBtn = document.getElementById('resetForm');
    const statusTitle = document.getElementById('statusTitle');
    const statusMessage = document.getElementById('statusMessage');
    const canvas = document.getElementById('particlesCanvas');
    
    // Estado del formulario
    let currentStep = 1;
    let totalSteps = 4;
    let formData = {
        nombre: '',
        email: '',
        telefono: '',
        tipoProyecto: '',
        asunto: '',
        mensaje: '',
        presupuesto: '',
        archivos: []
    };
    
    let particlesActive = true;
    
    // ===== SISTEMA DE STEPS =====
    function showStep(stepNumber) {
        // Ocultar todos los steps
        formSteps.forEach(step => {
            step.classList.remove('active');
        });
        
        // Mostrar step actual
        const currentStepElement = document.querySelector(`[data-step="${stepNumber}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        
        // Actualizar progreso
        const progressPercentage = ((stepNumber - 1) / (totalSteps - 1)) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        
        // Actualizar steps activos
        steps.forEach((step, index) => {
            if (index + 1 <= stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        currentStep = stepNumber;
        
        // Animación
        anime({
            targets: progressFill,
            width: `${progressPercentage}%`,
            easing: 'easeOutExpo',
            duration: 800
        });
    }
    
    // Botones Siguiente
    nextBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const nextStep = parseInt(this.dataset.next);
            
            // Validar step actual antes de avanzar
            if (validateStep(currentStep)) {
                showStep(nextStep);
                
                // Actualizar resumen si estamos en el último paso
                if (nextStep === 4) {
                    updateSummary();
                }
            }
        });
    });
    
    // Botones Anterior
    prevBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const prevStep = parseInt(this.dataset.prev);
            showStep(prevStep);
        });
    });
    
    // ===== VALIDACIÓN DE STEPS =====
    function validateStep(step) {
        let isValid = true;
        
        switch(step) {
            case 1:
                const nombre = document.getElementById('nombre');
                const email = document.getElementById('email');
                
                if (!nombre.value.trim()) {
                    showError(nombre, 'Por favor ingresa tu nombre');
                    isValid = false;
                } else {
                    clearError(nombre);
                }
                
                if (!email.value.trim()) {
                    showError(email, 'Por favor ingresa tu email');
                    isValid = false;
                } else if (!isValidEmail(email.value)) {
                    showError(email, 'Por favor ingresa un email válido');
                    isValid = false;
                } else {
                    clearError(email);
                }
                break;
                
            case 2:
                if (!formData.tipoProyecto) {
                    showNotification('Por favor selecciona un tipo de proyecto', 'warning');
                    isValid = false;
                }
                break;
                
            case 3:
                const asunto = document.getElementById('asunto');
                const mensaje = document.getElementById('mensaje');
                
                if (!asunto.value.trim()) {
                    showError(asunto, 'Por favor ingresa un asunto');
                    isValid = false;
                } else {
                    clearError(asunto);
                }
                
                if (!mensaje.value.trim()) {
                    showError(mensaje, 'Por favor ingresa tu mensaje');
                    isValid = false;
                } else if (mensaje.value.length < 10) {
                    showError(mensaje, 'El mensaje debe tener al menos 10 caracteres');
                    isValid = false;
                } else {
                    clearError(mensaje);
                }
                break;
        }
        
        return isValid;
    }
    
    function showError(input, message) {
        const inputGroup = input.closest('.input-group');
        const feedback = inputGroup.querySelector('.input-feedback');
        
        inputGroup.classList.add('error');
        feedback.textContent = message;
        
        // Animación de error
        anime({
            targets: input,
            translateX: [0, 10, -10, 0],
            easing: 'easeInOutSine',
            duration: 400
        });
    }
    
    function clearError(input) {
        const inputGroup = input.closest('.input-group');
        inputGroup.classList.remove('error');
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // ===== CONTADOR DE CARACTERES =====
    messageTextarea.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = length;
        
        // Cambiar color según longitud
        if (length > 450) {
            charCount.style.color = 'var(--future-accent)';
        } else if (length > 300) {
            charCount.style.color = 'var(--future-warning)';
        } else {
            charCount.style.color = 'var(--future-primary)';
        }
        
        // Guardar en formData
        formData.mensaje = this.value;
    });
    
    // ===== SELECTOR DE TIPO DE PROYECTO =====
    projectTypeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remover selección anterior
            projectTypeOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Seleccionar actual
            this.classList.add('selected');
            const type = this.dataset.type;
            
            // Actualizar formData
            formData.tipoProyecto = type;
            document.getElementById('tipoProyecto').value = type;
            
            // Animación
            anime({
                targets: this,
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0],
                easing: 'easeInOutSine',
                duration: 300
            });
        });
    });
    
    // ===== SELECTOR DE PRESUPUESTO =====
    budgetOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remover selección anterior
            budgetOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Seleccionar actual
            this.classList.add('selected');
            const budget = this.dataset.budget;
            
            // Actualizar formData
            formData.presupuesto = budget;
            document.getElementById('presupuesto').value = budget;
        });
    });
    
    // ===== SUBIDA DE ARCHIVOS =====
    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--future-primary)';
        uploadArea.style.background = 'rgba(0, 217, 255, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'rgba(0, 217, 255, 0.3)';
        uploadArea.style.background = 'transparent';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'rgba(0, 217, 255, 0.3)';
        uploadArea.style.background = 'transparent';
        
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
    
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        handleFiles(files);
    });
    
    function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification(`${file.name} es muy grande (máximo 5MB)`, 'error');
                continue;
            }
            
            // Validar tipo
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg',
                'image/png',
                'application/zip'
            ];
            
            if (!allowedTypes.includes(file.type)) {
                showNotification(`${file.name} tiene un formato no permitido`, 'error');
                continue;
            }
            
            // Agregar archivo
            formData.archivos.push(file);
            addFileToList(file);
        }
    }
    
    function addFileToList(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileSize = formatFileSize(file.size);
        
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file-alt file-icon"></i>
                <div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${fileSize}</div>
                </div>
            </div>
            <button class="file-remove" data-name="${file.name}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        fileList.appendChild(fileItem);
        
        // Animación
        anime({
            targets: fileItem,
            translateY: [20, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 300
        });
    }
    
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }
    
    // Remover archivo
    fileList.addEventListener('click', (e) => {
        if (e.target.closest('.file-remove')) {
            const fileName = e.target.closest('.file-remove').dataset.name;
            const fileItem = e.target.closest('.file-item');
            
            // Remover de formData
            formData.archivos = formData.archivos.filter(file => file.name !== fileName);
            
            // Animación de eliminación
            anime({
                targets: fileItem,
                translateX: [0, 100],
                opacity: [1, 0],
                easing: 'easeInExpo',
                duration: 300,
                complete: () => fileItem.remove()
            });
        }
    });
    
    // ===== ACTUALIZAR RESUMEN =====
    function updateSummary() {
        // Actualizar datos del resumen
        const fields = ['nombre', 'email', 'asunto'];
        fields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                formData[field] = element.value;
                const summaryElement = document.getElementById(`summary-${field}`);
                if (summaryElement) {
                    summaryElement.textContent = element.value;
                }
            }
        });
        
        // Tipo de proyecto
        const tipoElement = document.getElementById('summary-tipo');
        if (tipoElement) {
            const tipos = {
                'web': 'Desarrollo Web',
                'sistema': 'Sistema Personalizado',
                'consulta': 'Consulta Técnica',
                'otro': 'Otro Proyecto'
            };
            tipoElement.textContent = tipos[formData.tipoProyecto] || 'No especificado';
        }
        
        // Presupuesto
        const presupuestoElement = document.getElementById('summary-presupuesto');
        if (presupuestoElement) {
            const presupuestos = {
                '<1000': 'Menos de $1,000',
                '1000-5000': '$1,000 - $5,000',
                '5000-10000': '$5,000 - $10,000',
                '>10000': 'Más de $10,000',
                'indefinido': 'Por determinar'
            };
            presupuestoElement.textContent = presupuestos[formData.presupuesto] || 'No especificado';
        }
    }
    
    // ===== ENVÍO DEL FORMULARIO =====
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validar términos
        const terminos = document.getElementById('terminos');
        if (!terminos.checked) {
            showNotification('Debes aceptar los términos y condiciones', 'warning');
            terminos.focus();
            return;
        }
        
        // Mostrar estado de carga
        showLoadingState();
        
        // Aquí normalmente enviarías los datos a tu servidor
        // Simulamos una petición con setTimeout
        setTimeout(() => {
            // Simular éxito
            showSuccessState();
            
            // Aquí iría el código real para enviar el formulario
            // Ejemplo con Fetch API:
            /*
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'archivos') {
                    formData[key].forEach(file => {
                        formDataToSend.append('archivos[]', file);
                    });
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });
            
            try {
                const response = await fetch('/api/contacto', {
                    method: 'POST',
                    body: formDataToSend
                });
                
                if (response.ok) {
                    showSuccessState();
                } else {
                    showErrorState();
                }
            } catch (error) {
                showErrorState();
            }
            */
            
            // Guardar en localStorage para demo
            saveFormData();
        }, 2000);
    });
    
    function showLoadingState() {
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
    }
    
    function showSuccessState() {
        // Ocultar formulario, mostrar estado
        contactForm.style.display = 'none';
        formStatus.style.display = 'block';
        
        statusTitle.textContent = '¡Mensaje Enviado!';
        statusMessage.textContent = 'Gracias por contactarme. Te responderé en menos de 24 horas.';
        
        // Animación de éxito
        anime({
            targets: '.status-icon',
            scale: [0, 1],
            rotate: [0, 360],
            easing: 'easeOutBack',
            duration: 800
        });
    }
    
    function showErrorState() {
        statusTitle.textContent = 'Error al Enviar';
        statusMessage.textContent = 'Hubo un problema al enviar tu mensaje. Por favor intenta nuevamente.';
        formStatus.style.display = 'block';
    }
    
    function saveFormData() {
        // Guardar en localStorage para demo
        const contacts = JSON.parse(localStorage.getItem('contactos') || '[]');
        contacts.push({
            ...formData,
            fecha: new Date().toISOString(),
            archivos: formData.archivos.map(f => f.name)
        });
        localStorage.setItem('contactos', JSON.stringify(contacts));
    }
    
    // ===== BOTÓN REINICIAR =====
    resetFormBtn.addEventListener('click', function() {
        // Reiniciar formulario
        contactForm.reset();
        formData = {
            nombre: '',
            email: '',
            telefono: '',
            tipoProyecto: '',
            asunto: '',
            mensaje: '',
            presupuesto: '',
            archivos: []
        };
        
        // Limpiar UI
        document.querySelectorAll('.type-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelectorAll('.budget-option').forEach(opt => opt.classList.remove('selected'));
        fileList.innerHTML = '';
        charCount.textContent = '0';
        
        // Volver al paso 1
        showStep(1);
        
        // Mostrar formulario, ocultar estado
        contactForm.style.display = 'block';
        formStatus.style.display = 'none';
    });
    
    // ===== COPIAR TEXTO =====
    copyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.dataset.text;
            
            navigator.clipboard.writeText(text)
                .then(() => {
                    // Feedback visual
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                    
                    showNotification('Texto copiado al portapapeles', 'success');
                })
                .catch(err => {
                    console.error('Error al copiar: ', err);
                    showNotification('Error al copiar', 'error');
                });
        });
    });
    
    // ===== MODAL DEL MAPA =====
    openMapBtn.addEventListener('click', () => {
        mapModal.classList.add('active');
        document.body.style.overflow = 'hidden';
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
    
    // ===== FAQ ACORDEÓN =====
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            
            if (this.classList.contains('active')) {
                answer.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.classList.remove('open');
                answer.style.maxHeight = '0';
            }
        });
    });
    
    // ===== SCROLL AL FORMULARIO =====
    scrollToFormBtn.addEventListener('click', () => {
        document.querySelector('.formulario-container').scrollIntoView({
            behavior: 'smooth'
        });
    });
    
    // ===== SISTEMA DE PARTÍCULAS =====
    function initParticles() {
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
            if (!particlesActive) return;
            
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
    
    // Toggle partículas
    toggleParticles.addEventListener('click', () => {
        particlesActive = !particlesActive;
        canvas.style.opacity = particlesActive ? '1' : '0';
        
        // Cambiar ícono
        const icon = toggleParticles.querySelector('i');
        if (particlesActive) {
            icon.className = 'fas fa-magic';
            toggleParticles.innerHTML = '<i class="fas fa-magic"></i> Efectos ON';
        } else {
            icon.className = 'fas fa-eye-slash';
            toggleParticles.innerHTML = '<i class="fas fa-eye-slash"></i> Efectos OFF';
        }
    });
    
    // ===== NOTIFICACIONES =====
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos de notificación
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = 'var(--radius-future)';
        notification.style.color = 'white';
        notification.style.fontWeight = '600';
        notification.style.zIndex = '3000';
        notification.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'transform 0.3s ease';
        
        // Colores según tipo
        const colors = {
            success: 'var(--future-success)',
            error: 'var(--future-accent)',
            warning: 'var(--future-warning)',
            info: 'var(--future-primary)'
        };
        
        notification.style.background = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        // Animación de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    // ===== ANIMAR ESTADÍSTICAS =====
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const final = stat.dataset.count;
            let start = 0;
            const increment = final.includes('%') ? 
                parseInt(final) / 50 : 
                parseInt(final.replace('+', '')) / 50;
            const duration = 1500;
            const step = duration / (parseInt(final) / increment);
            
            const timer = setInterval(() => {
                start += increment;
                if (start >= parseInt(final)) {
                    stat.textContent = final;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(start) + (final.includes('%') ? '%' : final.includes('+') ? '+' : '');
                }
            }, step);
        });
    }
    
    // Observar cuando las estadísticas son visibles
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // ===== INICIALIZAR =====
    initParticles();
    
    // Guardar datos en tiempo real
    document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(input => {
        input.addEventListener('input', function() {
            formData[this.name] = this.value;
        });
    });
    
    // Mostrar notificación de bienvenida
    setTimeout(() => {
        showNotification('¡Bienvenido al formulario de contacto! Desplázate para comenzar.', 'info');
    }, 1000);
});