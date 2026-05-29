'use strict';

class IPriceListRepository {
  async findById(tenantId, id)          { throw new Error('Not implemented'); }
  async findAll(tenantId)               { throw new Error('Not implemented'); }
  async findActive(tenantId, at)        { throw new Error('Not implemented'); }
  async save(priceList)                 { throw new Error('Not implemented'); }
  async softDelete(tenantId, id, deletedBy) { throw new Error('Not implemented'); }
}

module.exports = IPriceListRepository;
