'use strict';

const QuotationStatus = Object.freeze({
  DRAFT:            'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED:         'APPROVED',
  SENT:             'SENT',
  REJECTED:         'REJECTED',
  EXPIRED:          'EXPIRED',
});

module.exports = QuotationStatus;
