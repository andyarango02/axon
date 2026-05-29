'use strict';

class Conversation {
  constructor({
    id,
    tenantId,
    customerId,
    channel,
    status,
    context,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    deletedAt,
  } = {}) {
    this.id = id;
    this.tenantId = tenantId;
    this.customerId = customerId;
    this.channel = channel;
    this.status = status;
    this.context = context || {};
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

module.exports = Conversation;
