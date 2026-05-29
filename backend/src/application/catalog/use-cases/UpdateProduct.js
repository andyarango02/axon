'use strict';

class UpdateProduct {
  constructor({ productRepository, eventBus }) {
    this.productRepository = productRepository;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, productId: string, changes: object, updatedBy?: string }} input
   * @returns {Promise<import('../../../domain/catalog/entities/Product')>}
   */
  async execute({ tenantId, productId, changes, updatedBy }) {
    const NotFoundError  = require('../../../shared/errors/NotFoundError');
    const ProductUpdated = require('../../../domain/catalog/events/ProductUpdated');

    const product = await this.productRepository.findById(tenantId, productId);
    if (!product) throw new NotFoundError('Product', productId);

    const allowed = ['name', 'description', 'type', 'basePrice', 'currency', 'unit', 'status', 'category', 'metadata', 'sku'];
    allowed.forEach(f => { if (f in changes) product[f] = changes[f]; });
    product.updatedBy = updatedBy || null;

    const saved = await this.productRepository.save(product);

    await this.eventBus.publish('ProductUpdated', new ProductUpdated({
      productId: saved.id,
      tenantId,
      updatedBy,
      changes,
    }));

    return saved;
  }
}

module.exports = UpdateProduct;
