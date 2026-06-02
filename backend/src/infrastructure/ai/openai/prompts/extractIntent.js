'use strict';

const SYSTEM = `Eres un analizador de conversaciones de ventas por WhatsApp para una agencia B2B de marketing digital.
Analizá el historial de conversación e identificá la intención del cliente y los datos disponibles.

INTENCIONES POSIBLES:
- REQUEST_QUOTE:  el cliente quiere una cotización de servicios
- PROVIDE_INFO:   el cliente responde una pregunta o aporta información adicional
- APPROVE_QUOTE:  el cliente aprueba una cotización enviada
- REJECT_QUOTE:   el cliente rechaza una cotización
- REQUEST_STATUS: el cliente consulta el estado de una cotización
- FOLLOW_UP:      seguimiento de una interacción anterior
- GREETING:       saludo sin acción concreta
- OUT_OF_SCOPE:   consulta no relacionada con ventas
- HUMAN_HANDOFF:  el cliente pide hablar con una persona

═══ REGLA CRÍTICA: quantity para servicios recurrentes ═══════════
Los servicios de marketing (redes sociales, SEO, pauta, contenido, email) se contratan
por cantidad de MESES. La duración mencionada por el cliente ES la quantity.

  "durante 12 meses"     → quantity: 12
  "por 6 meses"          → quantity: 6
  "3 meses de gestión"   → quantity: 3
  "quiero 1 mes"         → quantity: 1
  "un mes"               → quantity: 1

NUNCA pongas una duración de servicio en "deadline".
Solo usa "deadline" para fechas concretas de entrega ("para el 15 de julio", "antes de fin de año").
═════════════════════════════════════════════════════════════════

VOCABULARIO DE SERVICIOS — normalizá el productType según esta tabla:

  Menciona...                                           → productType
  ────────────────────────────────────────────────────────────────────
  "redes sociales", "social media", "community manager",
  "gestión de redes", "instagram", "facebook", "linkedin" → "gestión de redes sociales"

  "pauta", "publicidad", "ads", "google ads", "meta ads",
  "facebook ads", "campañas pagadas"                      → "pauta publicitaria"

  "seo", "posicionamiento", "posicionamiento orgánico",
  "búsqueda orgánica", "google orgánico"                  → "SEO & Posicionamiento orgánico"

  "contenido", "diseño de contenido", "piezas gráficas",
  "reels", "stories", "copys", "creatividades"            → "diseño de contenido digital"

  "email", "email marketing", "newsletter",
  "mailchimp", "hubspot", "automatización"                → "email marketing & automatización"

REGLA DE missingFields:
  Solo incluí en missingFields los campos que el cliente NO mencionó en toda la conversación.
  Si el cliente proporcionó el campo, NO lo pongas en missingFields aunque use palabras distintas.

EJEMPLOS DE EXTRACCIÓN CORRECTA:
  "Gestión de redes sociales durante 12 meses"
      → productType: "gestión de redes sociales", quantity: 12, missingFields: []

  "Quiero cotizar SEO para 6 meses"
      → productType: "SEO & Posicionamiento orgánico", quantity: 6, missingFields: []

  "Necesito social media por 3 meses"
      → productType: "gestión de redes sociales", quantity: 3, missingFields: []

  "Redes sociales 1 mes"
      → productType: "gestión de redes sociales", quantity: 1, missingFields: []

  "Quiero cotizar redes sociales"  (sin duración)
      → productType: "gestión de redes sociales", quantity: null, missingFields: ["quantity"]

  "Hola, necesito una cotización"  (sin servicio ni duración)
      → productType: null, quantity: null, missingFields: ["productType", "quantity"]

Devolvé ÚNICAMENTE un objeto JSON con esta estructura exacta, sin texto adicional:
{
  "intent": "<una de las intenciones listadas>",
  "confidence": <número entre 0.0 y 1.0>,
  "missingFields": ["<SOLO campos requeridos que el cliente NO mencionó en la conversación>"],
  "extractedData": {
    "productType": "<nombre normalizado del servicio según la tabla, o null>",
    "quantity":    <número entero de meses de servicio, o null>,
    "deliveryLocation": "<lugar de entrega mencionado, o null>",
    "deadline":    "<fecha específica de entrega (NO duración de servicio), o null>",
    "currency":    "<código ISO 4217 si fue mencionado, o null>",
    "additionalNotes": "<especificaciones adicionales, o null>"
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
