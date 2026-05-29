'use strict';

class PricingRule {
  constructor({
    id,
    tenantId,
    productId,
    strategy,
    conditions,
    value,
    validFrom,
    validUntil,
    priority,
    active,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    deletedAt,
  } = {}) {
    this.id = id;
    this.tenantId = tenantId;
    this.productId = productId || null; // null = applies to all products
    this.strategy = strategy;
    this.conditions = conditions || {};
    this.value = value;
    this.validFrom = validFrom || null;
    this.validUntil = validUntil || null;
    this.priority = priority || 0;
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

module.exports = PricingRule;
