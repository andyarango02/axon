'use strict';

const NotFoundError = require('../../../shared/errors/NotFoundError');

class GetQuotationById {
  constructor({ quotationRepository }) {
    this.quotationRepository = quotationRepository;
  }

  /**
   * @param {{ tenantId: string, quotationId: string }} input
   * @returns {Promise<import('../../../domain/quotation/entities/Quotation')>}
   */
  async execute({ tenantId, quotationId }) {
    const quotation = await this.quotationRepository.findById(tenantId, quotationId);
    if (!quotation) throw new NotFoundError('Quotation', quotationId);
    return quotation;
  }
}

module.exports = GetQuotationById;
