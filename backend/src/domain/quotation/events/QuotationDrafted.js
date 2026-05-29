'use strict';

class QuotationDrafted {
  constructor({ quotationId, tenantId, customerId, conversationId, timestamp } = {}) {
    this.name = 'QuotationDrafted';
    this.quotationId = quotationId;
    this.tenantId = tenantId;
    this.customerId = customerId;
    this.conversationId = conversationId;
    this.timestamp = timestamp || new Date();
  }
}

module.exports = QuotationDrafted;
