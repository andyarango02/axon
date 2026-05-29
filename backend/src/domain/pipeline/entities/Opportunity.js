'use strict';

class Opportunity {
  constructor({
    id,
    tenantId,
    customerId,
    quotationId,
    title,
    stage,
    estimatedValue,
    currency,
    expectedCloseDate,
    assignedTo,
    notes,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    deletedAt,
  } = {}) {
    this.id = id;
    this.tenantId = tenantId;
    this.customerId = customerId;
    this.quotationId = quotationId || null;
    this.title = title;
    this.stage = stage;
    this.estimatedValue = estimatedValue || 0;
    this.currency = currency || 'USD';
    this.expectedCloseDate = expectedCloseDate || null;
    this.assignedTo = assignedTo || null;
    this.notes = notes || null;
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

module.exports = Opportunity;
