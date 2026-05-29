'use strict';

const NotFoundError = require('../../../shared/errors/NotFoundError');

class UpdatePricingRule {
  constructor({ pricingRuleRepository }) {
    this.pricingRuleRepository = pricingRuleRepository;
  }

  /**
   * @param {{ tenantId: string, ruleId: string, changes: object, updatedBy?: string }} input
   * @returns {Promise<import('../../../domain/catalog/entities/PricingRule')>}
   */
  async execute({ tenantId, ruleId, changes, updatedBy }) {
    const rule = await this.pricingRuleRepository.findById(tenantId, ruleId);
    if (!rule) throw new NotFoundError('PricingRule', ruleId);

    const allowed = ['name', 'strategy', 'value', 'conditions', 'currency',
                     'validFrom', 'validUntil', 'priority', 'active', 'category', 'priceListId'];
    allowed.forEach(f => { if (f in changes) rule[f] = changes[f]; });
    rule.updatedBy = updatedBy || null;

    return this.pricingRuleRepository.save(rule);
  }
}

module.exports = UpdatePricingRule;
