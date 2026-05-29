'use strict';

class IOpportunityRepository {
  async findById(tenantId, id) { throw new Error('Not implemented'); }
  async findByCustomer(tenantId, customerId) { throw new Error('Not implemented'); }
  async findByStage(tenantId, stage) { throw new Error('Not implemented'); }
  async findAll(tenantId, filters) { throw new Error('Not implemented'); }
  async save(opportunity) { throw new Error('Not implemented'); }
  async softDelete(tenantId, id, deletedBy) { throw new Error('Not implemented'); }
}

module.exports = IOpportunityRepository;
