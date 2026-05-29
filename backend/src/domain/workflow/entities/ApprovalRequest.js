'use strict';

class ApprovalRequest {
  constructor({
    id,
    tenantId,
    workflowExecutionId,
    resourceType,
    resourceId,
    requestedBy,
    assignedTo,
    status,
    decision,
    decisionBy,
    decisionAt,
    comment,
    expiresAt,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
  } = {}) {
    this.id = id;
    this.tenantId = tenantId;
    this.workflowExecutionId = workflowExecutionId;
    this.resourceType = resourceType; // e.g. 'quotation'
    this.resourceId = resourceId;
    this.requestedBy = requestedBy;
    this.assignedTo = assignedTo || null;
    this.status = status;
    this.decision = decision || null;
    this.decisionBy = decisionBy || null;
    this.decisionAt = decisionAt || null;
    this.comment = comment || null;
    this.expiresAt = expiresAt || null;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
  }
}

module.exports = ApprovalRequest;
