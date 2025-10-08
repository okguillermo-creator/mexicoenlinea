document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            }
        });
    });

    // WhatsApp form submission handling
    function sendToWhatsApp(event) {
        event.preventDefault();
        
        // Recoger los datos del formulario
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const plan = document.getElementById('plan').value;
        const mensaje = document.getElementById('mensaje').value;

        // Crear el mensaje para WhatsApp
        const text = `¡Hola! Me interesa contratar un servicio de internet.%0A%0A` +
                    `*Datos de contacto:*%0A` +
                    `Nombre: ${nombre}%0A` +
                    `Email: ${email}%0A` +
                    `Teléfono: ${telefono}%0A%0A` +
                    `*Plan de interés:*%0A${plan}%0A%0A` +
                    (mensaje ? `*Mensaje adicional:*%0A${mensaje}` : '');

        // Número de WhatsApp de México en línea (reemplaza con tu número)
        const whatsappNumber = '529711646537';

        // Crear el enlace de WhatsApp y abrir en una nueva pestaña
        window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
        
        // Limpiar el formulario
        document.getElementById('contactForm').reset();
        
        return false;
    }

    // Animate services cards on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        observer.observe(card);
    });
});