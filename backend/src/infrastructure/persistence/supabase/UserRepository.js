'use strict';

const IUserRepository = require('../../../domain/user/repositories/IUserRepository');

class UserRepository extends IUserRepository {
  constructor(supabaseClient) {
    super();
    this.client = supabaseClient;
    this.table = 'users';
  }

  async findById(tenantId, id) {
    throw new Error('Not implemented');
  }

  async findByEmail(tenantId, email) {
    throw new Error('Not implemented');
  }

  async findAll(tenantId, filters) {
    throw new Error('Not implemented');
  }

  async save(user) {
    throw new Error('Not implemented');
  }

  async softDelete(tenantId, id, deletedBy) {
    throw new Error('Not implemented');
  }
}

module.exports = UserRepository;
