'use strict';

const ITenantRepository = require('../../../domain/tenant/repositories/ITenantRepository');

class TenantRepository extends ITenantRepository {
  constructor(supabaseClient) {
    super();
    this.client = supabaseClient;
    this.table = 'tenants';
  }

  async findById(id) {
    throw new Error('Not implemented');
  }

  async findBySlug(slug) {
    throw new Error('Not implemented');
  }

  async save(tenant) {
    throw new Error('Not implemented');
  }

  async softDelete(id, deletedBy) {
    throw new Error('Not implemented');
  }
}

module.exports = TenantRepository;
