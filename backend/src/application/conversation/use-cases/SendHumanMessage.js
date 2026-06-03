'use strict';

const Message       = require('../../../domain/conversation/entities/Message');
const NotFoundError = require('../../../shared/errors/NotFoundError');
const DomainError   = require('../../../shared/errors/DomainError');

class SendHumanMessage {
  constructor({ conversationRepository, customerRepository, messageRepository, messagingService = null }) {
    this.conversationRepository = conversationRepository;
    this.customerRepository     = customerRepository;
    this.messageRepository      = messageRepository;
    this.messagingService       = messagingService;
  }

  /**
   * @param {{ tenantId: string, conversationId: string, body: string, agentId?: string }} input
   */
  async execute({ tenantId, conversationId, body, agentId = 'agent' }) {
    const conversation = await this.conversationRepository.findById(tenantId, conversationId);
    if (!conversation) throw new NotFoundError('Conversation', conversationId);

    if (conversation.status === 'CLOSED') {
      throw new DomainError('Cannot send messages to a closed conversation', 'CONVERSATION_CLOSED');
    }

    const customer = await this.customerRepository.findById(tenantId, conversation.customerId);
    if (!customer) throw new NotFoundError('Customer', conversation.customerId);

    // Persist immediately — the message exists regardless of whether Twilio succeeds
    const message = await this.messageRepository.save(new Message({
      tenantId,
      conversationId,
      direction: 'OUTBOUND',
      body,
      createdBy: agentId,
    }));

    // Attempt Twilio send
    let outboundSent  = false;
    let outboundError = null;

    if (this.messagingService && customer.phone) {
      try {
        await this.messagingService.sendMessage({ to: customer.phone, body, tenantId });
        outboundSent = true;
      } catch (err) {
        console.error('[SendHumanMessage] Twilio send failed:', err.message);
        outboundError = err.message;
      }
    }

    return { message, outboundSent, outboundError };
  }
}

module.exports = SendHumanMessage;
