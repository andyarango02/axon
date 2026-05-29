'use strict';

const IProductRepository = require('../../../domain/catalog/repositories/IProductRepository');

class ProductRepository extends IProductRepository {
  constructor(supabaseClient) {
    super();
    this.client = supabaseClient;
    this.table = 'products';
  }

  async findById(tenantId, id) {
    throw new Error('Not implemented');
  }

  async findBySku(tenantId, sku) {
    throw new Error('Not implemented');
  }

  async search(tenantId, query, filters) {
    throw new Error('Not implemented');
  }

  async findAll(tenantId, filters) {
    throw new Error('Not implemented');
  }

  async save(product) {
    throw new Error('Not implemented');
  }

  async softDelete(tenantId, id, deletedBy) {
    throw new Error('Not implemented');
  }
}

module.exports = ProductRepository;
