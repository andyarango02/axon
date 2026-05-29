'use strict';

const IOpportunityRepository = require('../../../domain/pipeline/repositories/IOpportunityRepository');

class OpportunityRepository extends IOpportunityRepository {
  constructor(supabaseClient) {
    super();
    this.client = supabaseClient;
    this.table = 'opportunities';
  }

  async findById(tenantId, id) {
    throw new Error('Not implemented');
  }

  async findByCustomer(tenantId, customerId) {
    throw new Error('Not implemented');
  }

  async findByStage(tenantId, stage) {
    throw new Error('Not implemented');
  }

  async findAll(tenantId, filters) {
    throw new Error('Not implemented');
  }

  async save(opportunity) {
    throw new Error('Not implemented');
  }

  async softDelete(tenantId, id, deletedBy) {
    throw new Error('Not implemented');
  }
}

module.exports = OpportunityRepository;
