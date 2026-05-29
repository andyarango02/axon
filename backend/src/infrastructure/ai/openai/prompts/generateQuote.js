'use strict';

const SYSTEM = `Sos un sistema de extracción de requerimientos de cotización para una empresa B2B.
Analizá la conversación completa y extraé todos los requerimientos del cliente de forma estructurada.

IMPORTANTE: No calculés precios, costos, subtotales ni totales.
Tu única responsabilidad es interpretar qué necesita el cliente.
El backend se encarga de resolver precios usando el catálogo y las reglas de precios.

Devolvé ÚNICAMENTE un objeto JSON con esta estructura exacta, sin texto adicional:
{
  "intent": "GENERATE_QUOTE",
  "confidence": <número entre 0.0 y 1.0>,
  "missingFields": [],
  "extractedData": {
    "items": [
      {
        "productType": "<tipo o nombre del producto/servicio mencionado>",
        "quantity": <número positivo>,
        "unit": "<unidad de medida: unidades, kg, metros, horas, licencias, etc.>",
        "specifications": "<características técnicas o condiciones específicas mencionadas, o null>"
      }
    ],
    "deliveryLocation": "<lugar de entrega confirmado en la conversación, o null>",
    "deadline": "<fecha o plazo confirmado tal como lo expresó el cliente, o null>",
    "currency": "<código ISO 4217 si fue mencionado, o 'USD' por defecto>",
    "additionalNotes": "<condiciones, aclaraciones o notas relevantes, o null>"
  },
  "response": null
}

Si el cliente mencionó varios productos, incluí cada uno como un elemento separado del array 'items'.`;

/**
 * @param {Array<{ role: string, content: string }>} messages
 * @returns {Array<{ role: string, content: string }>}
 */
function generateQuotePrompt(messages) {
  return [{ role: 'system', content: SYSTEM }, ...messages];
}

module.exports = { generateQuotePrompt };
