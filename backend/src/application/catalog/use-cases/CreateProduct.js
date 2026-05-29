'use strict';

class CreateProduct {
  constructor({ productRepository, eventBus }) {
    this.productRepository = productRepository;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, name: string, basePrice: number, currency?: string, createdBy: string }} input
   * @returns {Promise<import('../../../domain/catalog/entities/Product')>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = CreateProduct;
