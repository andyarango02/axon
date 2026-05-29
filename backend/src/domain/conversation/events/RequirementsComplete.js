'use strict';

class RequirementsComplete {
  constructor({ conversationId, tenantId, customerId, requirements, timestamp } = {}) {
    this.name = 'RequirementsComplete';
    this.conversationId = conversationId;
    this.tenantId = tenantId;
    this.customerId = customerId;
    this.requirements = requirements;
    this.timestamp = timestamp || new Date();
  }
}

module.exports = RequirementsComplete;
