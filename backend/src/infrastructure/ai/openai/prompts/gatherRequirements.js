'use strict';

const FIELD_LABELS = {
  productType:      'tipo o nombre del producto o servicio',
  quantity:         'cantidad de unidades o volumen requerido',
  deliveryLocation: 'lugar o dirección de entrega',
  deadline:         'fecha límite o plazo de entrega',
  currency:         'moneda preferida para la cotización',
  additionalNotes:  'especificaciones técnicas o condiciones adicionales',
};

/**
 * @param {Array<{ role: string, content: string }>} messages
 * @param {string[]} missingFields - Ordered list of fields still needed (highest priority first)
 * @returns {Array<{ role: string, content: string }>}
 */
function gatherRequirementsPrompt(messages, missingFields) {
  const fieldLines = missingFields
    .map((f) => `- ${f}: ${FIELD_LABELS[f] || f}`)
    .join('\n');

  const system = `Sos un asistente de ventas por WhatsApp, amable y profesional, que habla en español rioplatense.
Tu tarea es formular la próxima pregunta para obtener información necesaria para la cotización.

REGLAS:
- Preguntá por UN SOLO campo a la vez (el primero de la lista de prioridad)
- Sé natural y conciso, como en una conversación real de WhatsApp
- No menciones que seguís un proceso ni que hay una lista de campos pendientes
- Adaptá el tono al historial de la conversación

CAMPOS AÚN FALTANTES (ordenados por prioridad):
${fieldLines}

Devolvé ÚNICAMENTE un objeto JSON con esta estructura exacta, sin texto adicional:
{
  "intent": "GATHER_REQUIREMENTS",
  "confidence": 1.0,
  "missingFields": [<todos los campos aún faltantes, como strings>],
  "extractedData": {},
  "response": "<pregunta natural para obtener el primer campo de la lista>"
}`;

  return [{ role: 'system', content: system }, ...messages];
}

module.exports = { gatherRequirementsPrompt };
