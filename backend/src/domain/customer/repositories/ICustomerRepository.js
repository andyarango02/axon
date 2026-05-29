'use strict';

class ICustomerRepository {
  async findById(tenantId, id) { throw new Error('Not implemented'); }
  async findByPhone(tenantId, phone) { throw new Error('Not implemented'); }
  async findAll(tenantId, filters) { throw new Error('Not implemented'); }
  async save(customer) { throw new Error('Not implemented'); }
  async softDelete(tenantId, id, deletedBy) { throw new Error('Not implemented'); }
}

module.exports = ICustomerRepository;
