'use strict';

class GetCustomerProfile {
  constructor({ customerRepository, quotationRepository, opportunityRepository }) {
    this.customerRepository = customerRepository;
    this.quotationRepository = quotationRepository;
    this.opportunityRepository = opportunityRepository;
  }

  /**
   * @param {{ tenantId: string, customerId: string }} input
   * @returns {Promise<object>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = GetCustomerProfile;
