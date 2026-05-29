'use strict';

const NotFoundError    = require('../../../shared/errors/NotFoundError');
const ApplicationError = require('../../../shared/errors/ApplicationError');

class GetPriceForProduct {
  constructor({ productRepository, pricingRuleRepository, priceCalculator }) {
    this.productRepository     = productRepository;
    this.pricingRuleRepository = pricingRuleRepository;
    this.priceCalculator       = priceCalculator;
  }

  /**
   * @param {{ tenantId: string, productId: string, quantity: number,
   *           priceListId?: string, at?: Date }} input
   * @returns {Promise<{ productId, productName, sku, quantity, unitPrice, discount, total, currency, ruleApplied, negotiable }>}
   */
  async execute({ tenantId, productId, quantity, priceListId = null, at = new Date() }) {
    const qty = +quantity;
    if (!qty || qty <= 0) throw new ApplicationError('quantity must be a positive number', 'INVALID_QUANTITY', 400);

    const product = await this.productRepository.findById(tenantId, productId);
    if (!product) throw new NotFoundError('Product', productId);

    const rules = priceListId
      ? await this.pricingRuleRepository.findByPriceList(tenantId, priceListId)
      : await this.pricingRuleRepository.findActiveRules(tenantId, at);

    const result = this.priceCalculator.calculate(product, rules, { quantity: qty, at });

    return {
      productId:   product.id,
      productName: product.name,
      sku:         product.sku,
      quantity:    qty,
      ...result,
    };
  }
}

module.exports = GetPriceForProduct;
