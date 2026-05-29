'use strict';

class FindOrCreateCustomer {
  constructor({ customerRepository, eventBus }) {
    this.customerRepository = customerRepository;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, phone: string, source: string, createdBy?: string }} input
   * @returns {Promise<import('../../../domain/customer/entities/Customer')>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = FindOrCreateCustomer;
