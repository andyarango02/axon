'use strict';

const Customer = require('../../../domain/customer/entities/Customer');
const Conversation = require('../../../domain/conversation/entities/Conversation');
const Message = require('../../../domain/conversation/entities/Message');
const ConversationStatus = require('../../../domain/conversation/value-objects/ConversationStatus');
const CustomerIdentified = require('../../../domain/customer/events/CustomerIdentified');
const MessageReceived = require('../../../domain/conversation/events/MessageReceived');

class HandleIncomingMessage {
  constructor({ conversationRepository, customerRepository, messageRepository, eventBus }) {
    this.conversationRepository = conversationRepository;
    this.customerRepository = customerRepository;
    this.messageRepository = messageRepository;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, from: string, body: string, channel?: string, externalId?: string }} input
   * @returns {Promise<{ conversationId: string, messageId: string, customerId: string, isNewCustomer: boolean }>}
   */
  async execute({ tenantId, from, body, channel = 'WHATSAPP', externalId = null }) {
    // 1. find or create customer
    let customer = await this.customerRepository.findByPhone(tenantId, from);
    const isNewCustomer = !customer;
    if (!customer) {
      customer = await this.customerRepository.save(
        new Customer({ tenantId, phone: from, source: channel, metadata: {} })
      );
      await this.eventBus.publish('CustomerIdentified', new CustomerIdentified({
        customerId: customer.id,
        tenantId,
        phone: from,
      }));
    }

    // 2. find or open conversation
    let conversation = await this.conversationRepository.findActiveByCustomer(tenantId, customer.id);
    if (!conversation) {
      conversation = await this.conversationRepository.save(
        new Conversation({
          tenantId,
          customerId: customer.id,
          channel,
          status: ConversationStatus.GATHERING_INFO,
          context: {},
        })
      );
    }

    // 3. persist inbound message
    const savedMsg = await this.messageRepository.save(
      new Message({
        tenantId,
        conversationId: conversation.id,
        direction: 'INBOUND',
        body,
        externalId,
      })
    );

    // 4. emit domain event
    await this.eventBus.publish('MessageReceived', new MessageReceived({
      conversationId: conversation.id,
      tenantId,
      messageId: savedMsg.id,
      content: body,
      from,
    }));

    return {
      conversationId: conversation.id,
      messageId: savedMsg.id,
      customerId: customer.id,
      isNewCustomer,
    };
  }
}

module.exports = HandleIncomingMessage;
