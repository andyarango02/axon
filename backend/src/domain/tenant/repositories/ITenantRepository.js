'use strict';

class ITenantRepository {
  async findById(id) { throw new Error('Not implemented'); }
  async findBySlug(slug) { throw new Error('Not implemented'); }
  async save(tenant) { throw new Error('Not implemented'); }
  async softDelete(id, deletedBy) { throw new Error('Not implemented'); }
}

module.exports = ITenantRepository;
