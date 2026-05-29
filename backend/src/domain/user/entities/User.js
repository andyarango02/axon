'use strict';

class User {
  constructor({
    id,
    tenantId,
    email,
    name,
    role,
    passwordHash,
    active,
    lastLoginAt,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    deletedAt,
  } = {}) {
    this.id = id;
    this.tenantId = tenantId;
    this.email = email;
    this.name = name;
    this.role = role;
    this.passwordHash = passwordHash;
    this.active = active !== undefined ? active : true;
    this.lastLoginAt = lastLoginAt || null;
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

module.exports = User;
