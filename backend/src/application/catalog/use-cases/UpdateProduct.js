'use strict';

class UpdateProduct {
  constructor({ productRepository, eventBus }) {
    this.productRepository = productRepository;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, productId: string, changes: object, updatedBy: string }} input
   * @returns {Promise<void>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = UpdateProduct;
