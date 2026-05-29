'use strict';

class IPricingRuleRepository {
  async findByProduct(tenantId, productId) { throw new Error('Not implemented'); }
  async findActiveRules(tenantId) { throw new Error('Not implemented'); }
  async save(pricingRule) { throw new Error('Not implemented'); }
  async softDelete(tenantId, id, deletedBy) { throw new Error('Not implemented'); }
}

module.exports = IPricingRuleRepository;
