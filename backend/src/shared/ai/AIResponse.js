'use strict';

/**
 * Standard envelope returned by every IAIService method.
 *
 * intent        — one of IntentType constants
 * confidence    — model confidence score (0.0 – 1.0)
 * missingFields — required quote fields not yet provided by the customer
 * extractedData — method-specific payload (see IAIService JSDoc for shape per method)
 * response      — natural-language text to send back to the customer, or null
 */
class AIResponse {
  constructor({ intent, confidence, missingFields, extractedData, response } = {}) {
    this.intent        = intent;
    this.confidence    = confidence    ?? 0;
    this.missingFields = Array.isArray(missingFields) ? missingFields : [];
    this.extractedData = extractedData && typeof extractedData === 'object' ? extractedData : {};
    this.response      = response ?? null;
  }
}

module.exports = AIResponse;
