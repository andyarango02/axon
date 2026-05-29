'use strict';

const NotFoundError = require('../../../shared/errors/NotFoundError');

class ManagePriceList {
  constructor({ priceListRepository }) {
    this.priceListRepository = priceListRepository;
  }

  /**
   * Update or deactivate an existing price list.
   * @param {{ tenantId: string, priceListId: string, changes: object, executedBy?: string }} input
   * @returns {Promise<import('../../../domain/catalog/entities/PriceList')>}
   */
  async execute({ tenantId, priceListId, changes, executedBy }) {
    const list = await this.priceListRepository.findById(tenantId, priceListId);
    if (!list) throw new NotFoundError('PriceList', priceListId);

    const allowed = ['name', 'description', 'currency', 'validFrom', 'validUntil', 'active'];
    allowed.forEach(f => { if (f in changes) list[f] = changes[f]; });
    list.updatedBy = executedBy || null;

    return this.priceListRepository.save(list);
  }
}

module.exports = ManagePriceList;
