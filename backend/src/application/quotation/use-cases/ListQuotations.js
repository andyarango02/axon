'use strict';

class ListQuotations {
  constructor({ quotationRepository }) {
    this.quotationRepository = quotationRepository;
  }

  /**
   * @param {{ tenantId: string, filters?: object, page?: number, limit?: number }} input
   * @returns {Promise<{ data: object[], total: number }>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = ListQuotations;
