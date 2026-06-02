'use strict';

class ListQuotations {
  constructor({ quotationRepository }) {
    this.quotationRepository = quotationRepository;
  }

  /**
   * @param {{ tenantId: string, filters?: { status?, customerId?, conversationId? } }} input
   * @returns {Promise<import('../../../domain/quotation/entities/Quotation')[]>}
   */
  async execute({ tenantId, filters = {} }) {
    return this.quotationRepository.findAll(tenantId, filters);
  }
}

module.exports = ListQuotations;
