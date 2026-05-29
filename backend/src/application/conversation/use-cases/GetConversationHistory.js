'use strict';

class GetConversationHistory {
  constructor({ conversationRepository }) {
    this.conversationRepository = conversationRepository;
  }

  /**
   * @param {{ tenantId: string, conversationId: string }} input
   * @returns {Promise<object>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = GetConversationHistory;
