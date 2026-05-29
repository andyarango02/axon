'use strict';

class QuotationSent {
  constructor({ quotationId, tenantId, customerId, channel, timestamp } = {}) {
    this.name = 'QuotationSent';
    this.quotationId = quotationId;
    this.tenantId = tenantId;
    this.customerId = customerId;
    this.channel = channel;
    this.timestamp = timestamp || new Date();
  }
}

module.exports = QuotationSent;
