'use strict';

const QuotationStatus   = require('../../../domain/quotation/value-objects/QuotationStatus');
const QuotationRejected = require('../../../domain/quotation/events/QuotationRejected');
const NotFoundError     = require('../../../shared/errors/NotFoundError');
const DomainError       = require('../../../shared/errors/DomainError');

class RejectQuotation {
  constructor({ quotationRepository, eventBus }) {
    this.quotationRepository = quotationRepository;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, quotationId: string, rejectedBy?: string, reason?: string }} input
   * @returns {Promise<Quotation>}
   */
  async execute({ tenantId, quotationId, rejectedBy, reason }) {
    const quotation = await this.quotationRepository.findById(tenantId, quotationId);
    if (!quotation) throw new NotFoundError('Quotation', quotationId);

    if (quotation.status !== QuotationStatus.PENDING_APPROVAL) {
      throw new DomainError(
        `Cannot reject quotation in status ${quotation.status}`,
        'INVALID_STATUS',
      );
    }

    quotation.status = QuotationStatus.REJECTED;
    if (rejectedBy) quotation.updatedBy = rejectedBy;

    const updated = await this.quotationRepository.save(quotation);

    await this.eventBus.publish(
      new QuotationRejected({ quotationId, tenantId, rejectedBy, reason }),
    );

    return updated;
  }
}

module.exports = RejectQuotation;
