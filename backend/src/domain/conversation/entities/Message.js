'use strict';

class Message {
  constructor({
    id,
    tenantId,
    conversationId,
    direction,
    body,
    mediaUrl,
    externalId,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
  } = {}) {
    this.id = id;
    this.tenantId = tenantId;
    this.conversationId = conversationId;
    this.direction = direction; // INBOUND | OUTBOUND
    this.body = body;
    this.mediaUrl = mediaUrl || null;
    this.externalId = externalId || null;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
  }
}

module.exports = Message;
