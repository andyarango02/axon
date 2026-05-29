'use strict';

class ManagePricingRules {
  constructor({ pricingRuleRepository }) {
    this.pricingRuleRepository = pricingRuleRepository;
  }

  /**
   * @param {{ tenantId: string, action: 'create'|'update'|'delete', payload: object, executedBy: string }} input
   * @returns {Promise<void>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = ManagePricingRules;
