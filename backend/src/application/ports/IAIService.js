'use strict';

/**
 * Port: AI language model service.
 * All methods return Promise<AIResponse> — see shared/ai/AIResponse.js.
 *
 * Responsibility boundary:
 *   - The AI interprets intent, extracts data, detects missing fields, and writes questions.
 *   - The AI does NOT calculate prices, totals, or apply pricing rules.
 *   - Price resolution is always owned by the backend (catalog + PriceCalculator).
 */
class IAIService {
  /**
   * Analyze conversation history to identify intent and extract available data.
   *
   * extractedData shape:
   *   { productType, quantity, deliveryLocation, deadline, currency, additionalNotes }
   *
   * @param {Array<{ role: string, content: string }>} messages
   * @returns {Promise<import('../../shared/ai/AIResponse')>}
   */
  async extractIntent(messages) { throw new Error('Not implemented'); }

  /**
   * Generate the next clarifying question for the highest-priority missing field.
   *
   * extractedData: {} (empty — the question is in AIResponse.response)
   *
   * @param {Array<{ role: string, content: string }>} messages
   * @param {string[]} missingFields - Fields still needed to proceed to quoting
   * @returns {Promise<import('../../shared/ai/AIResponse')>}
   */
  async gatherRequirements(messages, missingFields) { throw new Error('Not implemented'); }

  /**
   * Extract fully structured requirements from the complete conversation.
   * Does NOT calculate prices — returns only what the customer needs.
   * The backend uses this output with catalog + pricing rules to build the quote.
   *
   * extractedData shape:
   *   {
   *     items: [{ productType, quantity, unit, specifications }],
   *     deliveryLocation, deadline, currency, additionalNotes
   *   }
   *
   * @param {Array<{ role: string, content: string }>} messages
   * @returns {Promise<import('../../shared/ai/AIResponse')>}
   */
  async generateQuote(messages) { throw new Error('Not implemented'); }
}

module.exports = IAIService;
