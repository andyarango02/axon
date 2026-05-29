'use strict';

class ListPriceLists {
  constructor({ priceListRepository }) {
    this.priceListRepository = priceListRepository;
  }

  async execute({ tenantId }) {
    return this.priceListRepository.findAll(tenantId);
  }
}

module.exports = ListPriceLists;
