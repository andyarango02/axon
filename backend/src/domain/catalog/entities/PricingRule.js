'use strict';

class PricingRule {
  constructor({
    id,
    tenantId,
    name,
    productId,
    priceListId,
    category,
    strategy,
    conditions,
    value,
    currency,
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
    this.id          = id;
    this.tenantId    = tenantId;
    this.name        = name        || null;
    this.productId   = productId   || null; // null = no specific product
    this.priceListId = priceListId || null;
    this.category    = category    || null; // applies to all products in this category
    this.strategy    = strategy;
    this.conditions  = conditions  || {};
    this.value       = value;
    this.currency    = currency    || null; // overrides product currency when set
    this.validFrom   = validFrom   || null;
    this.validUntil  = validUntil  || null;
    this.priority    = priority    || 0;
    this.active      = active !== undefined ? active : true;
    this.createdAt   = createdAt;
    this.updatedAt   = updatedAt;
    this.createdBy   = createdBy;
    this.updatedBy   = updatedBy;
    this.deletedAt   = deletedAt   || null;
  }

  get isDeleted() { return this.deletedAt !== null; }

  // True when this rule targets the given product (by id, category, or globally)
  isApplicableTo(product) {
    if (this.productId) return this.productId === product.id;
    if (this.category)  return this.category  === product.category;
    return true; // global rule — applies to all products
  }

  isActiveAt(date = new Date()) {
    if (!this.active || this.deletedAt) return false;
    if (this.validFrom  && date < new Date(this.validFrom))  return false;
    if (this.validUntil && date > new Date(this.validUntil)) return false;
    return true;
  }
}

module.exports = PricingRule;
