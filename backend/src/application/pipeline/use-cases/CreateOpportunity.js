'use strict';

class CreateOpportunity {
  constructor({ opportunityRepository, eventBus }) {
    this.opportunityRepository = opportunityRepository;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, customerId: string, quotationId?: string, title: string, estimatedValue?: number, createdBy: string }} input
   * @returns {Promise<import('../../../domain/pipeline/entities/Opportunity')>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = CreateOpportunity;
