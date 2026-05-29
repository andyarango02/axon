'use strict';

const PricingRule = require('../../../domain/catalog/entities/PricingRule');

class CreatePricingRule {
  constructor({ pricingRuleRepository }) {
    this.pricingRuleRepository = pricingRuleRepository;
  }

  /**
   * @param {{ tenantId: string, name?: string, strategy: string, value: number,
   *           productId?: string, priceListId?: string, category?: string,
   *           conditions?: object, currency?: string,
   *           validFrom?: string, validUntil?: string,
   *           priority?: number, createdBy?: string }} input
   * @returns {Promise<import('../../../domain/catalog/entities/PricingRule')>}
   */
  async execute({ tenantId, name, strategy, value, productId, priceListId, category,
                  conditions, currency, validFrom, validUntil, priority, createdBy }) {
    const rule = new PricingRule({
      tenantId,
      name:        name        || null,
      strategy,
      value,
      productId:   productId   || null,
      priceListId: priceListId || null,
      category:    category    || null,
      conditions:  conditions  || {},
      currency:    currency    || null,
      validFrom:   validFrom   || null,
      validUntil:  validUntil  || null,
      priority:    priority    ?? 0,
      active:      true,
      createdBy:   createdBy   || null,
      updatedBy:   createdBy   || null,
    });
    return this.pricingRuleRepository.save(rule);
  }
}

module.exports = CreatePricingRule;
