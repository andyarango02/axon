'use strict';

class PriceCalculator {
  /**
   * @param {import('../entities/Product')} product
   * @param {import('../entities/PricingRule')[]} rules
   * @param {{ quantity: number, context?: object }} options
   * @returns {{ unitPrice: number, discount: number, total: number }}
   */
  calculate(product, rules, options) {
    throw new Error('Not implemented');
  }
}

module.exports = PriceCalculator;
