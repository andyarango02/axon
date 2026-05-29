'use strict';

class ApprovalRequested {
  constructor({ approvalRequestId, tenantId, resourceType, resourceId, assignedTo, timestamp } = {}) {
    this.name = 'ApprovalRequested';
    this.approvalRequestId = approvalRequestId;
    this.tenantId = tenantId;
    this.resourceType = resourceType;
    this.resourceId = resourceId;
    this.assignedTo = assignedTo;
    this.timestamp = timestamp || new Date();
  }
}

module.exports = ApprovalRequested;
