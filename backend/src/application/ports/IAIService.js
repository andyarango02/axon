'use strict';

class IAIService {
  /**
   * @param {object[]} messages
   * @returns {Promise<{ intent: string, confidence: number, entities: object }>}
   */
  async extractIntent(messages) { throw new Error('Not implemented'); }

  /**
   * @param {object[]} messages
   * @param {string[]} missingFields
   * @returns {Promise<{ question: string, fieldTargeted: string }>}
   */
  async gatherRequirements(messages, missingFields) { throw new Error('Not implemented'); }

  /**
   * @param {object} requirements
   * @param {object[]} products
   * @returns {Promise<{ items: object[], notes: string }>}
   */
  async generateQuote(requirements, products) { throw new Error('Not implemented'); }
}

module.exports = IAIService;
