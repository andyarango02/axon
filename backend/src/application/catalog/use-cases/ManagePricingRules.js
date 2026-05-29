'use strict';

class ManagePricingRules {
  constructor({ pricingRuleRepository }) {
    this.pricingRuleRepository = pricingRuleRepository;
  }

  /**
   * @deprecated Use CreatePricingRule / UpdatePricingRule / DeletePricingRule instead.
   */
  async execute(_input) {
    throw new Error('Deprecated: use CreatePricingRule, UpdatePricingRule, or DeletePricingRule');
  }
}

module.exports = ManagePricingRules;
