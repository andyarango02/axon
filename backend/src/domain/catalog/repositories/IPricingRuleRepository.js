'use strict';

class IPricingRuleRepository {
  async findById(tenantId, id)                        { throw new Error('Not implemented'); }
  async findAll(tenantId)                             { throw new Error('Not implemented'); }
  async findByProduct(tenantId, productId)            { throw new Error('Not implemented'); }
  async findActiveRules(tenantId, at)                 { throw new Error('Not implemented'); }
  async findActiveByCategory(tenantId, category, at)  { throw new Error('Not implemented'); }
  async findByPriceList(tenantId, priceListId)        { throw new Error('Not implemented'); }
  async save(pricingRule)                             { throw new Error('Not implemented'); }
  async softDelete(tenantId, id, deletedBy)           { throw new Error('Not implemented'); }
}

module.exports = IPricingRuleRepository;
