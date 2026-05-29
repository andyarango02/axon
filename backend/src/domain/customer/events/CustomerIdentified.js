'use strict';

class CustomerIdentified {
  constructor({ customerId, tenantId, phone, conversationId, timestamp } = {}) {
    this.name = 'CustomerIdentified';
    this.customerId = customerId;
    this.tenantId = tenantId;
    this.phone = phone;
    this.conversationId = conversationId;
    this.timestamp = timestamp || new Date();
  }
}

module.exports = CustomerIdentified;
