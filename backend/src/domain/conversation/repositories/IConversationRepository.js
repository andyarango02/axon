'use strict';

class IConversationRepository {
  async findById(tenantId, id) { throw new Error('Not implemented'); }
  async findAll(tenantId, filters) { throw new Error('Not implemented'); }
  async findActiveByCustomer(tenantId, customerId) { throw new Error('Not implemented'); }
  async save(conversation) { throw new Error('Not implemented'); }
  async softDelete(tenantId, id, deletedBy) { throw new Error('Not implemented'); }
}

module.exports = IConversationRepository;
