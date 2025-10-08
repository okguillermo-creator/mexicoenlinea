const whatsappWidget = {
    // Configuración global del widget
    phoneNumbers: {
        oficina1: '529711646537',
        oficina2: '529712080143'
    },

    init: function() {
        this.createWidget();
    },

    createWidget: function() {
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
                    <div class="message">
                        ¡Hola! 👋 Bienvenido a México en Línea. ¿En qué podemos ayudarte?

                        1️⃣ Información sobre planes y precios
                        2️⃣ Consultar cobertura en mi zona
                        3️⃣ Soporte técnico
                        4️⃣ Contactar a un asesor
                        5️⃣ Reportar una falla
                    </div>
                    <div class="button-container">
                        <button data-option="1">1️⃣ Planes y precios</button>
                        <button data-option="2">2️⃣ Consultar cobertura</button>
                        <button data-option="3">3️⃣ Soporte técnico</button>
                        <button data-option="4">4️⃣ Contactar asesor</button>
                        <button data-option="5">5️⃣ Reportar falla</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(widget);
        this.attachEventListeners(widget);
    },

    attachEventListeners: function(widget) {
        const trigger = widget.querySelector('.widget-trigger');
        const close = widget.querySelector('.close-widget');
        const content = widget.querySelector('.widget-content');
        
        trigger.addEventListener('click', () => {
            content.classList.remove('hidden');
        });

        close.addEventListener('click', () => {
            content.classList.add('hidden');
        });

        this.attachButtonListeners(widget);
    },

    attachButtonListeners: function(container) {
        const buttons = container.querySelectorAll('.button-container button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const option = e.target.getAttribute('data-option');
                this.handleOption(option);
            });
        });
    },

    handleOption: function(option) {
        const messages = {
            '1': {
                text: 'Hola, me gustaría información sobre los planes y precios de internet',
                number: this.phoneNumbers.oficina1
            },
            '2': {
                text: 'Hola, quisiera consultar si tienen cobertura en mi zona',
                number: this.phoneNumbers.oficina1
            },
            '3': {
                text: 'Hola, necesito soporte técnico para mi servicio',
                number: this.phoneNumbers.oficina2
            },
            '4': {
                showOptions: true,
                message: 'Selecciona la oficina para contactar:\n\nA) Oficina Principal\nB) Oficina Soporte'
            },
            '5': {
                text: 'Hola, necesito reportar una falla en mi servicio',
                number: this.phoneNumbers.oficina2
            },
            'A': {
                text: 'Hola, me gustaría hablar con un asesor',
                number: this.phoneNumbers.oficina1
            },
            'B': {
                text: 'Hola, me gustaría hablar con un asesor',
                number: this.phoneNumbers.oficina2
            }
        };

        const response = messages[option];
        if (!response) return;

        if (response.showOptions) {
            const messageDiv = document.querySelector('.widget-body');
            messageDiv.innerHTML = `
                <div class="message">${response.message}</div>
                <div class="button-container">
                    <button data-option="A">A) Oficina Principal</button>
                    <button data-option="B">B) Oficina Soporte</button>
                </div>
            `;
            
            this.attachButtonListeners(messageDiv);
        } else {
            const whatsappUrl = `https://wa.me/${response.number}?text=${encodeURIComponent(response.text)}`;
            window.open(whatsappUrl, '_blank');
        }
    }
};