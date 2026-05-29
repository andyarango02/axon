'use strict';

class CatalogController {
  constructor({ searchProducts, createProduct, updateProduct, managePricingRules }) {
    this.searchProducts = searchProducts;
    this.createProduct = createProduct;
    this.updateProduct = updateProduct;
    this.managePricingRules = managePricingRules;
  }

  async listProducts(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }

  async createProduct(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }

  async updateProduct(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }

  async listPricingRules(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }

  async managePricingRules(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CatalogController;
