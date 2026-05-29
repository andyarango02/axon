'use strict';

class GenerateQuotationDraft {
  constructor({ quotationRepository, productRepository, pricingRuleRepository, aiService, eventBus }) {
    this.quotationRepository = quotationRepository;
    this.productRepository = productRepository;
    this.pricingRuleRepository = pricingRuleRepository;
    this.aiService = aiService;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, conversationId: string, customerId: string, requirements: object, createdBy: string }} input
   * @returns {Promise<import('../../../domain/quotation/entities/Quotation')>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = GenerateQuotationDraft;
