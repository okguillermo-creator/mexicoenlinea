require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Mensajes predefinidos
const MESSAGES = {
    WELCOME: '¡Hola! 👋 Bienvenido a México en Línea. ¿En qué podemos ayudarte?\n\n' +
            '1️⃣ Información sobre planes y precios\n' +
            '2️⃣ Consultar cobertura en mi zona\n' +
            '3️⃣ Soporte técnico\n' +
            '4️⃣ Contactar a un asesor\n' +
            '5️⃣ Reportar una falla',
    PLANS: 'Nuestros planes disponibles son:\n\n' +
           '📡 Plan Básico - 30 Mbps - $300\n' +
           '📡 Plan Medio - 50 Mbps - $350\n' +
           '📡 Plan Avanzado - 100 Mbps - $400\n\n' +
           'Para contratar, escribe el número del plan que te interesa.',
    COVERAGE: 'Para verificar la cobertura en tu zona, por favor comparte tu ubicación o escribe tu dirección completa.',
    SUPPORT: 'Para brindarte soporte técnico, necesito algunos detalles:\n\n' +
            '1. ¿Cuál es tu número de cliente?\n' +
            '2. ¿Qué problema estás experimentando?\n' +
            '3. ¿Desde cuándo ocurre el problema?',
    REPORT_ISSUE: 'Lamento que estés teniendo problemas. Para ayudarte mejor, necesito:\n\n' +
                  '1. Tu número de cliente\n' +
                  '2. Una descripción del problema\n' +
                  '3. Tu dirección',
    DEFAULT: 'No entendí tu mensaje. Por favor, elige una opción del menú principal escribiendo un número del 1 al 5.'
};

// Verificación del webhook
app.get('/webhook', (req, res) => {
    const verify_token = process.env.VERIFY_TOKEN;
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token && mode === 'subscribe' && token === verify_token) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// Manejo de mensajes entrantes
app.post('/webhook', async (req, res) => {
    if (req.body.object) {
        if (req.body.entry &&
            req.body.entry[0].changes &&
            req.body.entry[0].changes[0] &&
            req.body.entry[0].changes[0].value.messages &&
            req.body.entry[0].changes[0].value.messages[0]) {

            const phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
            const from = req.body.entry[0].changes[0].value.messages[0].from;
            const msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;

            let response = MESSAGES.DEFAULT;

            // Procesar el mensaje recibido
            switch (msg_body) {
                case '1':
                    response = MESSAGES.PLANS;
                    break;
                case '2':
                    response = MESSAGES.COVERAGE;
                    break;
                case '3':
                    response = MESSAGES.SUPPORT;
                    break;
                case '4':
                    // Aquí podríamos implementar la lógica para asignar a un asesor disponible
                    response = 'Un asesor se pondrá en contacto contigo pronto.';
                    break;
                case '5':
                    response = MESSAGES.REPORT_ISSUE;
                    break;
                default:
                    if (!msg_body.startsWith('1') && !msg_body.startsWith('2') && 
                        !msg_body.startsWith('3') && !msg_body.startsWith('4') && 
                        !msg_body.startsWith('5')) {
                        response = MESSAGES.WELCOME;
                    }
            }

            // Enviar respuesta
            try {
                await axios({
                    method: 'POST',
                    url: `https://graph.facebook.com/v12.0/${phone_number_id}/messages?access_token=${process.env.WHATSAPP_TOKEN}`,
                    data: {
                        messaging_product: 'whatsapp',
                        to: from,
                        text: { body: response }
                    },
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

app.listen(port, () => {
    console.log(`Webhook listening on port ${port}`);
});