'use strict';

class MessageReceived {
  constructor({ conversationId, tenantId, messageId, content, from, timestamp } = {}) {
    this.name = 'MessageReceived';
    this.conversationId = conversationId;
    this.tenantId = tenantId;
    this.messageId = messageId;
    this.content = content;
    this.from = from;
    this.timestamp = timestamp || new Date();
  }
}

module.exports = MessageReceived;
