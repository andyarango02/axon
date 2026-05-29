'use strict';

const PriceList        = require('../../../domain/catalog/entities/PriceList');
const ApplicationError = require('../../../shared/errors/ApplicationError');

class CreatePriceList {
  constructor({ priceListRepository }) {
    this.priceListRepository = priceListRepository;
  }

  /**
   * @param {{ tenantId: string, name: string, description?: string, currency?: string,
   *           validFrom?: string, validUntil?: string, createdBy?: string }} input
   * @returns {Promise<import('../../../domain/catalog/entities/PriceList')>}
   */
  async execute({ tenantId, name, description, currency, validFrom, validUntil, createdBy }) {
    const existing = (await this.priceListRepository.findAll(tenantId)).find(l => l.name === name);
    if (existing) throw new ApplicationError(`Price list "${name}" already exists`, 'DUPLICATE_PRICE_LIST', 409);

    const list = new PriceList({
      tenantId,
      name,
      description: description || null,
      currency:    currency    || 'USD',
      validFrom:   validFrom   || null,
      validUntil:  validUntil  || null,
      active:      true,
      createdBy:   createdBy   || null,
      updatedBy:   createdBy   || null,
    });

    return this.priceListRepository.save(list);
  }
}

module.exports = CreatePriceList;
