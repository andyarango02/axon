'use strict';

const ICustomerRepository = require('../../../domain/customer/repositories/ICustomerRepository');

class CustomerRepository extends ICustomerRepository {
  constructor(supabaseClient) {
    super();
    this.client = supabaseClient;
    this.table = 'customers';
  }

  async findById(tenantId, id) {
    throw new Error('Not implemented');
  }

  async findByPhone(tenantId, phone) {
    throw new Error('Not implemented');
  }

  async findAll(tenantId, filters) {
    throw new Error('Not implemented');
  }

  async save(customer) {
    throw new Error('Not implemented');
  }

  async softDelete(tenantId, id, deletedBy) {
    throw new Error('Not implemented');
  }
}

module.exports = CustomerRepository;
