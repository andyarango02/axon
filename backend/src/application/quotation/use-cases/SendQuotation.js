'use strict';

class SendQuotation {
  constructor({ quotationRepository, customerRepository, messagingService, eventBus }) {
    this.quotationRepository = quotationRepository;
    this.customerRepository = customerRepository;
    this.messagingService = messagingService;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, quotationId: string, sentBy: string }} input
   * @returns {Promise<void>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = SendQuotation;
