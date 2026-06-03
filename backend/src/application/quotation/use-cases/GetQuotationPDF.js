'use strict';

const NotFoundError = require('../../../shared/errors/NotFoundError');

class GetQuotationPDF {
  constructor({ quotationRepository, customerRepository, pdfGenerator }) {
    this.quotationRepository = quotationRepository;
    this.customerRepository  = customerRepository;
    this.pdfGenerator        = pdfGenerator;
  }

  async execute({ tenantId, quotationId }) {
    const quotation = await this.quotationRepository.findById(tenantId, quotationId);
    if (!quotation) throw new NotFoundError('Quotation', quotationId);

    const customer = await this.customerRepository.findById(tenantId, quotation.customerId)
      .catch(() => null);

    const buffer   = await this.pdfGenerator.generate(quotation, customer);
    const filename = `cotizacion-${quotation.id.slice(0, 8)}.pdf`;

    return { buffer, filename, quotation };
  }
}

module.exports = GetQuotationPDF;
