'use strict';

class HandleIncomingMessage {
  constructor({ conversationRepository, customerRepository, aiService, messagingService, eventBus }) {
    this.conversationRepository = conversationRepository;
    this.customerRepository = customerRepository;
    this.aiService = aiService;
    this.messagingService = messagingService;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, from: string, body: string, channel: string, externalId?: string }} input
   * @returns {Promise<void>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = HandleIncomingMessage;
