'use strict';

const IAIService = require('../../../application/ports/IAIService');

class OpenAIService extends IAIService {
  constructor(openaiClient, prompts) {
    super();
    this.client = openaiClient;
    this.prompts = prompts;
  }

  async extractIntent(messages) {
    throw new Error('Not implemented');
  }

  async gatherRequirements(messages, missingFields) {
    throw new Error('Not implemented');
  }

  async generateQuote(requirements, products) {
    throw new Error('Not implemented');
  }
}

module.exports = OpenAIService;
