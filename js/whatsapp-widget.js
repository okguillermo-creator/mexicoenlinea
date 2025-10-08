const whatsappWidget = {
    init: function() {
        // Configuración del widget
        const config = {
            phoneNumber: '529711646537',
            welcomeMessage: '¡Hola! 👋 Bienvenido a México en Línea. ¿En qué podemos ayudarte?\n\n' +
                          '1️⃣ Información sobre planes\n' +
                          '2️⃣ Consultar cobertura\n' +
                          '3️⃣ Soporte técnico\n' +
                          '4️⃣ Hablar con un asesor',
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

        // Manejar respuestas numéricas
        widget.addEventListener('keypress', (e) => {
            if (e.key >= '1' && e.key <= '4') {
                this.handleResponse(e.key, config.phoneNumber);
            }
        });
    },

    handleResponse: function(option, phoneNumber) {
        const messages = {
            '1': 'Me gustaría información sobre los planes de internet',
            '2': 'Quisiera consultar la cobertura en mi zona',
            '3': 'Necesito soporte técnico',
            '4': 'Quisiera hablar con un asesor'
        };

        const message = messages[option];
        if (message) {
            window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
        }
    }
};