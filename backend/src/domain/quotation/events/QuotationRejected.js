'use strict';

class QuotationRejected {
  constructor({ quotationId, tenantId, rejectedBy, reason, timestamp } = {}) {
    this.name = 'QuotationRejected';
    this.quotationId = quotationId;
    this.tenantId = tenantId;
    this.rejectedBy = rejectedBy;
    this.reason = reason || null;
    this.timestamp = timestamp || new Date();
  }
}

module.exports = QuotationRejected;
