'use strict';

class SearchProducts {
  constructor({ productRepository }) {
    this.productRepository = productRepository;
  }

  /**
   * @param {{ tenantId: string, query: string, filters?: object }} input
   * @returns {Promise<import('../../../domain/catalog/entities/Product')[]>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = SearchProducts;
