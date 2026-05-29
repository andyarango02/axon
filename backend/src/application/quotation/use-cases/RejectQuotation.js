'use strict';

class RejectQuotation {
  constructor({ quotationRepository, eventBus }) {
    this.quotationRepository = quotationRepository;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, quotationId: string, rejectedBy: string, reason?: string }} input
   * @returns {Promise<void>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = RejectQuotation;
