'use strict';

class Product {
  constructor({
    id,
    tenantId,
    sku,
    name,
    description,
    type,
    basePrice,
    currency,
    unit,
    status,
    category,
    metadata,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    deletedAt,
  } = {}) {
    this.id          = id;
    this.tenantId    = tenantId;
    this.sku         = sku         || null;
    this.name        = name;
    this.description = description || null;
    this.type        = type        || 'PHYSICAL';
    this.basePrice   = basePrice   ?? null;  // nullable: services may have no fixed price
    this.currency    = currency    || 'USD';
    this.unit        = unit        || null;
    this.status      = status      || 'ACTIVE';
    this.category    = category    || null;
    this.metadata    = metadata    || {};
    this.createdAt   = createdAt;
    this.updatedAt   = updatedAt;
    this.createdBy   = createdBy;
    this.updatedBy   = updatedBy;
    this.deletedAt   = deletedAt   || null;
  }

  get isDeleted()  { return this.deletedAt !== null; }
  get isService()  { return this.type === 'SERVICE'; }
  get isPhysical() { return this.type === 'PHYSICAL'; }
}

module.exports = Product;
