'use strict';

class WorkflowDefinition {
  constructor({
    id,
    tenantId,
    name,
    triggerEvent,
    steps,
    active,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    deletedAt,
  } = {}) {
    this.id = id;
    this.tenantId = tenantId;
    this.name = name;
    this.triggerEvent = triggerEvent;
    this.steps = steps || [];
    this.active = active !== undefined ? active : true;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.deletedAt = deletedAt || null;
  }

  get isDeleted() {
    return this.deletedAt !== null;
  }
}

module.exports = WorkflowDefinition;
