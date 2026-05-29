'use strict';

class Customer {
  constructor({
    id,
    tenantId,
    phone,
    name,
    email,
    company,
    source,
    metadata,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    deletedAt,
  } = {}) {
    this.id = id;
    this.tenantId = tenantId;
    this.phone = phone;
    this.name = name || null;
    this.email = email || null;
    this.company = company || null;
    this.source = source;
    this.metadata = metadata || {};
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

module.exports = Customer;
