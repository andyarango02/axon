'use strict';

class ApprovalGranted {
  constructor({ approvalRequestId, tenantId, resourceType, resourceId, grantedBy, timestamp } = {}) {
    this.name = 'ApprovalGranted';
    this.approvalRequestId = approvalRequestId;
    this.tenantId = tenantId;
    this.resourceType = resourceType;
    this.resourceId = resourceId;
    this.grantedBy = grantedBy;
    this.timestamp = timestamp || new Date();
  }
}

module.exports = ApprovalGranted;
