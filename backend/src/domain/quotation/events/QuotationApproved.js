'use strict';

class QuotationApproved {
  constructor({ quotationId, tenantId, approvedBy, timestamp } = {}) {
    this.name = 'QuotationApproved';
    this.quotationId = quotationId;
    this.tenantId = tenantId;
    this.approvedBy = approvedBy;
    this.timestamp = timestamp || new Date();
  }
}

module.exports = QuotationApproved;
