'use strict';

class SearchProducts {
  constructor({ productRepository }) {
    this.productRepository = productRepository;
  }

  /**
   * @param {{ tenantId: string, query?: string, filters?: { status?, category?, type? } }} input
   * @returns {Promise<import('../../../domain/catalog/entities/Product')[]>}
   */
  async execute({ tenantId, query = '', filters = {} }) {
    return this.productRepository.search(tenantId, query, filters);
  }
}

module.exports = SearchProducts;
