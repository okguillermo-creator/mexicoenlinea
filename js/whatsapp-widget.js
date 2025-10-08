const whatsappWidget = {
    init: function() {
        // Configuración del widget
        const config = {
            phoneNumbers: {
                oficina1: '529711646537',
                oficina2: '529712080143'
            },
            welcomeMessage: '¡Hola! 👋 Bienvenido a México en Línea. ¿En qué podemos ayudarte?\n\n' +
                          '1️⃣ Información sobre planes y precios\n' +
                          '2️⃣ Consultar cobertura en mi zona\n' +
                          '3️⃣ Soporte técnico\n' +
                          '4️⃣ Contactar a un asesor\n' +
                          '5️⃣ Reportar una falla',
            position: 'right'
        };

        this.createWidget(config);
    },

    createWidget: function(config) {
        const widget = document.createElement('div');
        widget.className = 'whatsapp-widget';
        widget.innerHTML = `
            <div class="widget-trigger">
                <i class="fab fa-whatsapp"></i>
            </div>
            <div class="widget-content hidden">
                <div class="widget-header">
                    <img src="images/logo.png" alt="México en Línea">
                    <span>Asistente Virtual</span>
                    <button class="close-widget">&times;</button>
                </div>
                <div class="widget-body">
                    <div class="message">${config.welcomeMessage}</div>
                </div>
            </div>
        `;

        document.body.appendChild(widget);
        this.addEventListeners(widget, config);
    },

    addEventListeners: function(widget, config) {
        const trigger = widget.querySelector('.widget-trigger');
        const close = widget.querySelector('.close-widget');
        const content = widget.querySelector('.widget-content');

        trigger.addEventListener('click', () => {
            content.classList.remove('hidden');
        });

        close.addEventListener('click', () => {
            content.classList.add('hidden');
        });

        // Manejar respuestas numéricas y letras
        widget.addEventListener('keypress', (e) => {
            const key = e.key.toUpperCase();
            if ((key >= '1' && key <= '5') || key === 'A' || key === 'B') {
                this.handleResponse(key, config);
            }
        });
    },

    handleResponse: function(option, config) {
        const messages = {
            '1': {
                text: 'Hola, me gustaría información sobre los planes y precios de internet',
                number: config.phoneNumbers.oficina1
            },
            '2': {
                text: 'Hola, quisiera consultar si tienen cobertura en mi zona',
                number: config.phoneNumbers.oficina1
            },
            '3': {
                text: 'Hola, necesito soporte técnico para mi servicio',
                number: config.phoneNumbers.oficina2
            },
            '4': {
                showOptions: true,
                message: 'Selecciona la oficina para contactar:\n\n' +
                        'A) Oficina Principal: 971 164 6537\n' +
                        'B) Oficina Soporte: 971 208 0143'
            },
            '5': {
                text: 'Hola, necesito reportar una falla en mi servicio',
                number: config.phoneNumbers.oficina2
            },
            'A': {
                text: 'Hola, me gustaría hablar con un asesor',
                number: config.phoneNumbers.oficina1
            },
            'B': {
                text: 'Hola, me gustaría hablar con un asesor',
                number: config.phoneNumbers.oficina2
            }
        };

        const response = messages[option];
        
        if (response) {
            if (response.showOptions) {
                // Mostrar opciones adicionales
                const messageDiv = document.querySelector('.widget-body .message');
                messageDiv.textContent = response.message;
                return;
            }

            // Abrir WhatsApp con el mensaje correspondiente
            window.open(`https://wa.me/${response.number}?text=${encodeURIComponent(response.text)}`);
        }
    }
};