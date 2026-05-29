'use strict';

class PriceList {
  constructor({
    id,
    tenantId,
    name,
    description,
    currency,
    validFrom,
    validUntil,
    active,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    deletedAt,
  } = {}) {
    this.id          = id;
    this.tenantId    = tenantId;
    this.name        = name;
    this.description = description || null;
    this.currency    = currency    || 'USD';
    this.validFrom   = validFrom   || null;
    this.validUntil  = validUntil  || null;
    this.active      = active !== undefined ? active : true;
    this.createdAt   = createdAt;
    this.updatedAt   = updatedAt;
    this.createdBy   = createdBy;
    this.updatedBy   = updatedBy;
    this.deletedAt   = deletedAt   || null;
  }

  get isDeleted() { return this.deletedAt !== null; }

  isActiveAt(date = new Date()) {
    if (!this.active || this.deletedAt) return false;
    if (this.validFrom  && date < new Date(this.validFrom))  return false;
    if (this.validUntil && date > new Date(this.validUntil)) return false;
    return true;
  }
}

module.exports = PriceList;
