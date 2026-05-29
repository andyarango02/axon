'use strict';

const IConversationRepository = require('../../../domain/conversation/repositories/IConversationRepository');

class ConversationRepository extends IConversationRepository {
  constructor(supabaseClient) {
    super();
    this.client = supabaseClient;
    this.table = 'conversations';
  }

  async findById(tenantId, id) {
    throw new Error('Not implemented');
  }

  async findActiveByCustomer(tenantId, customerId) {
    throw new Error('Not implemented');
  }

  async save(conversation) {
    throw new Error('Not implemented');
  }

  async softDelete(tenantId, id, deletedBy) {
    throw new Error('Not implemented');
  }
}

module.exports = ConversationRepository;
