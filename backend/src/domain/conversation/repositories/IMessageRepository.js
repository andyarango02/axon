'use strict';

class IMessageRepository {
  async save(message) { throw new Error('Not implemented'); }
  async findByConversation(tenantId, conversationId, limit, offset) { throw new Error('Not implemented'); }
}

module.exports = IMessageRepository;
