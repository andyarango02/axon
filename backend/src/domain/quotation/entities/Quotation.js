'use strict';

class Quotation {
  constructor({
    id,
    tenantId,
    conversationId,
    customerId,
    opportunityId,
    status,
    items,
    subtotal,
    tax,
    total,
    currency,
    validUntil,
    notes,
    externalRef,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    deletedAt,
  } = {}) {
    this.id = id;
    this.tenantId = tenantId;
    this.conversationId = conversationId;
    this.customerId = customerId;
    this.opportunityId = opportunityId || null;
    this.status = status;
    this.items = items || [];
    this.subtotal = subtotal || 0;
    this.tax = tax || 0;
    this.total = total || 0;
    this.currency = currency || 'USD';
    this.validUntil = validUntil || null;
    this.notes = notes || null;
    this.externalRef = externalRef || null;
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

module.exports = Quotation;
