'use strict';

const QuotationStatus  = require('../../../domain/quotation/value-objects/QuotationStatus');
const QuotationApproved = require('../../../domain/quotation/events/QuotationApproved');
const NotFoundError    = require('../../../shared/errors/NotFoundError');
const DomainError      = require('../../../shared/errors/DomainError');

class ApproveQuotation {
  constructor({ quotationRepository, eventBus }) {
    this.quotationRepository = quotationRepository;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, quotationId: string, approvedBy?: string }} input
   * @returns {Promise<Quotation>}
   */
  async execute({ tenantId, quotationId, approvedBy }) {
    const quotation = await this.quotationRepository.findById(tenantId, quotationId);
    if (!quotation) throw new NotFoundError('Quotation', quotationId);

    if (quotation.status !== QuotationStatus.PENDING_APPROVAL) {
      throw new DomainError(
        `Cannot approve quotation in status ${quotation.status}`,
        'INVALID_STATUS',
      );
    }

    quotation.status = QuotationStatus.APPROVED;
    if (approvedBy) quotation.updatedBy = approvedBy;

    const updated = await this.quotationRepository.save(quotation);

    await this.eventBus.publish(
      new QuotationApproved({ quotationId, tenantId, approvedBy }),
    );

    return updated;
  }
}

module.exports = ApproveQuotation;
