'use strict';

class Tenant {
  constructor({
    id,
    name,
    slug,
    plan,
    settings,
    active,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    deletedAt,
  } = {}) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.plan = plan || 'free';
    this.settings = settings || {};
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

module.exports = Tenant;
