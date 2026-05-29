'use strict';

const SYSTEM = `Eres un analizador de conversaciones de ventas por WhatsApp para una empresa B2B.
Analizá el historial de conversación e identificá la intención del cliente y los datos disponibles.

INTENCIONES POSIBLES:
- REQUEST_QUOTE: el cliente quiere una cotización de productos o servicios
- PROVIDE_INFO: el cliente está respondiendo una pregunta o aportando datos
- APPROVE_QUOTE: el cliente aprueba una cotización enviada
- REJECT_QUOTE: el cliente rechaza una cotización
- REQUEST_STATUS: el cliente consulta el estado de una cotización o pedido
- FOLLOW_UP: el cliente hace seguimiento de una interacción anterior
- GREETING: saludo o conversación sin acción concreta necesaria
- OUT_OF_SCOPE: consulta no relacionada con ventas ni cotizaciones
- HUMAN_HANDOFF: el cliente pide hablar con una persona

CAMPOS NECESARIOS PARA UNA COTIZACIÓN:
  Requeridos: productType, quantity
  Opcionales: deliveryLocation, deadline, currency, additionalNotes

Devolvé ÚNICAMENTE un objeto JSON con esta estructura exacta, sin texto adicional:
{
  "intent": "<una de las intenciones listadas>",
  "confidence": <número entre 0.0 y 1.0>,
  "missingFields": ["<campos requeridos que aún no fueron proporcionados>"],
  "extractedData": {
    "productType": "<tipo o nombre del producto/servicio, o null>",
    "quantity": <número entero positivo, o null>,
    "deliveryLocation": "<lugar de entrega mencionado, o null>",
    "deadline": "<fecha o plazo mencionado tal como lo expresó el cliente, o null>",
    "currency": "<código de moneda ISO 4217 si fue mencionado, o null>",
    "additionalNotes": "<especificaciones técnicas u otras aclaraciones relevantes, o null>"
  },
  "response": null
}`;

/**
 * @param {Array<{ role: string, content: string }>} messages
 * @returns {Array<{ role: string, content: string }>}
 */
function extractIntentPrompt(messages) {
  return [{ role: 'system', content: SYSTEM }, ...messages];
}

module.exports = { extractIntentPrompt };
