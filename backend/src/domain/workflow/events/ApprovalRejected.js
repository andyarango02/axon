'use strict';

class ApprovalRejected {
  constructor({ approvalRequestId, tenantId, resourceType, resourceId, rejectedBy, comment, timestamp } = {}) {
    this.name = 'ApprovalRejected';
    this.approvalRequestId = approvalRequestId;
    this.tenantId = tenantId;
    this.resourceType = resourceType;
    this.resourceId = resourceId;
    this.rejectedBy = rejectedBy;
    this.comment = comment || null;
    this.timestamp = timestamp || new Date();
  }
}

module.exports = ApprovalRejected;
