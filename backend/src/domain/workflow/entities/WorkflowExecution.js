'use strict';

class WorkflowExecution {
  constructor({
    id,
    tenantId,
    workflowDefinitionId,
    triggerPayload,
    status,
    currentStep,
    context,
    startedAt,
    completedAt,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
  } = {}) {
    this.id = id;
    this.tenantId = tenantId;
    this.workflowDefinitionId = workflowDefinitionId;
    this.triggerPayload = triggerPayload || {};
    this.status = status;
    this.currentStep = currentStep || 0;
    this.context = context || {};
    this.startedAt = startedAt || null;
    this.completedAt = completedAt || null;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
  }
}

module.exports = WorkflowExecution;
