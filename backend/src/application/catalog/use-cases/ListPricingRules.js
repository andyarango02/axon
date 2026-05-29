'use strict';

class ListPricingRules {
  constructor({ pricingRuleRepository }) {
    this.pricingRuleRepository = pricingRuleRepository;
  }

  /**
   * @param {{ tenantId: string, productId?: string, priceListId?: string,
   *           category?: string, at?: Date }} input
   */
  async execute({ tenantId, productId, priceListId, category, at = new Date() }) {
    if (priceListId) return this.pricingRuleRepository.findByPriceList(tenantId, priceListId);
    if (productId)   return this.pricingRuleRepository.findByProduct(tenantId, productId);
    if (category)    return this.pricingRuleRepository.findActiveByCategory(tenantId, category, at);
    // Admin listing: return all non-deleted rules regardless of validity dates.
    // findActiveRules (date-filtered) is reserved for the PriceCalculator.
    return this.pricingRuleRepository.findAll(tenantId);
  }
}

module.exports = ListPricingRules;
