'use strict';

const NotFoundError = require('../../../shared/errors/NotFoundError');

class GetPricingRule {
  constructor({ pricingRuleRepository }) {
    this.pricingRuleRepository = pricingRuleRepository;
  }

  async execute({ tenantId, ruleId }) {
    const rule = await this.pricingRuleRepository.findById(tenantId, ruleId);
    if (!rule) throw new NotFoundError('PricingRule', ruleId);
    return rule;
  }
}

module.exports = GetPricingRule;
