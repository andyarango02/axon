'use strict';

const IQuotationRepository = require('../../../domain/quotation/repositories/IQuotationRepository');

class QuotationRepository extends IQuotationRepository {
  constructor(supabaseClient) {
    super();
    this.client = supabaseClient;
    this.table = 'quotations';
  }

  async findById(tenantId, id) {
    throw new Error('Not implemented');
  }

  async findByConversation(tenantId, conversationId) {
    throw new Error('Not implemented');
  }

  async findByCustomer(tenantId, customerId, filters) {
    throw new Error('Not implemented');
  }

  async findAll(tenantId, filters) {
    throw new Error('Not implemented');
  }

  async save(quotation) {
    throw new Error('Not implemented');
  }

  async softDelete(tenantId, id, deletedBy) {
    throw new Error('Not implemented');
  }
}

module.exports = QuotationRepository;
