'use strict';

class ApproveQuotation {
  constructor({ quotationRepository, eventBus }) {
    this.quotationRepository = quotationRepository;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, quotationId: string, approvedBy: string }} input
   * @returns {Promise<void>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = ApproveQuotation;
