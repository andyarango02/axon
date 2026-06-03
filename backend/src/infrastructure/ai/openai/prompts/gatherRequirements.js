'use strict';

const FIELD_LABELS = {
  productType:      'tipo o nombre del producto o servicio',
  quantity:         'cantidad de unidades o volumen requerido',
  deliveryLocation: 'lugar o dirección de entrega',
  deadline:         'fecha límite o plazo de entrega',
  currency:         'moneda preferida para la cotización',
  additionalNotes:  'especificaciones técnicas o condiciones adicionales',
};

const TONE_INSTRUCTIONS = {
  friendly:     'Sé cálido, cercano y empático. Hablá como si conocieras al cliente. Podés usar emojis con moderación si encajan naturalmente.',
  professional: 'Sé formal, claro y directo. Mantenés un trato cortés pero sin informalidades.',
  casual:       'Sé informal y descontracturado, como un amigo que sabe del tema. Usá lenguaje coloquial de WhatsApp.',
};

/**
 * @param {Array<{ role: string, content: string }>} messages
 * @param {string[]} missingFields - Ordered list of fields still needed (highest priority first)
 * @param {object} botConfig - Tenant bot configuration
 * @returns {Array<{ role: string, content: string }>}
 */
function gatherRequirementsPrompt(messages, missingFields, botConfig = {}) {
  const {
    name                = 'Asistente',
    businessName        = '',
    businessDescription = '',
    tone                = 'friendly',
    additionalContext   = '',
  } = botConfig;

  const fieldLines = missingFields
    .map((f) => `- ${f}: ${FIELD_LABELS[f] || f}`)
    .join('\n');

  const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.friendly;

  const businessLines = [
    businessName        && `Nombre del negocio: ${businessName}`,
    businessDescription && `Descripción: ${businessDescription}`,
    additionalContext   && `Contexto adicional: ${additionalContext}`,
  ].filter(Boolean).join('\n');

  const system = `Sos ${name}${businessName ? `, asistente de ventas de ${businessName}` : ', un asistente de ventas'}, que atiende por WhatsApp en español rioplatense.
Tu tarea es formular la próxima pregunta para obtener información necesaria para la cotización.
${businessLines ? `\nCONTEXTO DEL NEGOCIO:\n${businessLines}\n` : ''}
TONO: ${toneInstruction}

REGLAS:
- Preguntá por UN SOLO campo a la vez (el primero de la lista de prioridad)
- Sé natural y conciso, como en una conversación real de WhatsApp
- No menciones que seguís un proceso ni que hay una lista de campos pendientes
- Adaptá el tono al historial de la conversación
- Si el cliente ya dio información, reconocela brevemente antes de preguntar lo siguiente

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
