'use strict';

class ListConversations {
  constructor({ conversationRepository }) {
    this.conversationRepository = conversationRepository;
  }

  /**
   * @param {{ tenantId: string, filters?: { status?: string, customerId?: string } }} input
   * @returns {Promise<Conversation[]>}
   */
  async execute({ tenantId, filters = {} }) {
    return this.conversationRepository.findAll(tenantId, filters);
  }
}

module.exports = ListConversations;
