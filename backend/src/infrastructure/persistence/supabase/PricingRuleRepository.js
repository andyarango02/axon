'use strict';

const IPricingRuleRepository = require('../../../domain/catalog/repositories/IPricingRuleRepository');

class PricingRuleRepository extends IPricingRuleRepository {
  constructor(supabaseClient) {
    super();
    this.client = supabaseClient;
    this.table = 'pricing_rules';
  }

  async findByProduct(tenantId, productId) {
    throw new Error('Not implemented');
  }

  async findActiveRules(tenantId) {
    throw new Error('Not implemented');
  }

  async save(pricingRule) {
    throw new Error('Not implemented');
  }

  async softDelete(tenantId, id, deletedBy) {
    throw new Error('Not implemented');
  }
}

module.exports = PricingRuleRepository;
