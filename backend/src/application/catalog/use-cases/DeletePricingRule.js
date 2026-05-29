'use strict';

const NotFoundError = require('../../../shared/errors/NotFoundError');

class DeletePricingRule {
  constructor({ pricingRuleRepository }) {
    this.pricingRuleRepository = pricingRuleRepository;
  }

  async execute({ tenantId, ruleId, deletedBy }) {
    const rule = await this.pricingRuleRepository.findById(tenantId, ruleId);
    if (!rule) throw new NotFoundError('PricingRule', ruleId);
    await this.pricingRuleRepository.softDelete(tenantId, ruleId, deletedBy || null);
  }
}

module.exports = DeletePricingRule;
