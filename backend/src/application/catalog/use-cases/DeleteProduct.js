'use strict';

const NotFoundError = require('../../../shared/errors/NotFoundError');

class DeleteProduct {
  constructor({ productRepository }) {
    this.productRepository = productRepository;
  }

  async execute({ tenantId, productId, deletedBy }) {
    const product = await this.productRepository.findById(tenantId, productId);
    if (!product) throw new NotFoundError('Product', productId);
    await this.productRepository.softDelete(tenantId, productId, deletedBy || null);
  }
}

module.exports = DeleteProduct;
