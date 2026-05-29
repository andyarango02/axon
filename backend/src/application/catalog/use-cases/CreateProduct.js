'use strict';

class CreateProduct {
  constructor({ productRepository, eventBus }) {
    this.productRepository = productRepository;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, name: string, type?: string, sku?: string, description?: string,
   *           basePrice?: number, currency?: string, unit?: string, category?: string,
   *           metadata?: object, createdBy?: string }} input
   * @returns {Promise<import('../../../domain/catalog/entities/Product')>}
   */
  async execute({ tenantId, name, type, sku, description, basePrice, currency, unit, category, metadata, createdBy }) {
    const Product       = require('../../../domain/catalog/entities/Product');
    const ApplicationError = require('../../../shared/errors/ApplicationError');

    if (sku) {
      const existing = await this.productRepository.findBySku(tenantId, sku);
      if (existing) throw new ApplicationError(`Product with SKU "${sku}" already exists`, 'DUPLICATE_SKU', 409);
    }

    const product = new Product({
      tenantId,
      sku:         sku         || null,
      name,
      description: description || null,
      type:        type        || 'PHYSICAL',
      basePrice:   basePrice   ?? null,
      currency:    currency    || 'USD',
      unit:        unit        || null,
      category:    category    || null,
      metadata:    metadata    || {},
      status:      'ACTIVE',
      createdBy:   createdBy   || null,
      updatedBy:   createdBy   || null,
    });

    return this.productRepository.save(product);
  }
}

module.exports = CreateProduct;
