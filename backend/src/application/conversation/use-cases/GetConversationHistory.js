'use strict';

const NotFoundError = require('../../../shared/errors/NotFoundError');

class GetConversationHistory {
  constructor({ conversationRepository, messageRepository }) {
    this.conversationRepository = conversationRepository;
    this.messageRepository = messageRepository;
  }

  /**
   * @param {{ tenantId: string, conversationId: string, limit?: number, offset?: number }} input
   * @returns {Promise<{ conversation: object, messages: object[] }>}
   */
  async execute({ tenantId, conversationId, limit = 50, offset = 0 }) {
    const conversation = await this.conversationRepository.findById(tenantId, conversationId);
    if (!conversation) throw new NotFoundError('Conversation', conversationId);

    const messages = await this.messageRepository.findByConversation(tenantId, conversationId, limit, offset);

    return { conversation, messages };
  }
}

module.exports = GetConversationHistory;
