'use strict';

const QuotationStatus = require('../../../domain/quotation/value-objects/QuotationStatus');
const QuotationItem   = require('../../../domain/quotation/entities/QuotationItem');
const NotFoundError   = require('../../../shared/errors/NotFoundError');
const DomainError     = require('../../../shared/errors/DomainError');

const EDITABLE_STATUSES = new Set([QuotationStatus.DRAFT, QuotationStatus.PENDING_APPROVAL]);

class EditQuotation {
  constructor({ quotationRepository }) {
    this.quotationRepository = quotationRepository;
  }

  async execute({ tenantId, quotationId, items, updatedBy = null }) {
    const quotation = await this.quotationRepository.findById(tenantId, quotationId);
    if (!quotation) throw new NotFoundError('Quotation', quotationId);

    if (!EDITABLE_STATUSES.has(quotation.status)) {
      throw new DomainError(
        `Cannot edit quotation in status ${quotation.status}`,
        'INVALID_STATUS',
      );
    }

    const updatedItems = items.map((item, idx) => {
      const original = quotation.items[idx] || {};
      const qty      = Math.max(0, Number(item.quantity)  || 0);
      const price    = Math.max(0, Number(item.unitPrice) || 0);
      const discount = Math.min(100, Math.max(0, Number(item.discount) || 0));
      const total    = round2(qty * price * (1 - discount / 100));

      return new QuotationItem({
        id:          item.id || original.id || null,
        tenantId,
        quotationId,
        productId:   original.productId   || null,
        description: (item.description ?? original.description) || '',
        quantity:    qty,
        unitPrice:   price,
        discount,
        total,
        createdBy:   original.createdBy || null,
        updatedBy,
      });
    });

    const subtotal = round2(updatedItems.reduce((s, i) => s + i.total, 0));

    quotation.items    = updatedItems;
    quotation.subtotal = subtotal;
    quotation.total    = round2(subtotal + quotation.tax);
    quotation.updatedBy = updatedBy;

    return this.quotationRepository.save(quotation);
  }
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

module.exports = EditQuotation;
