'use strict';

const Customer           = require('../../../domain/customer/entities/Customer');
const Conversation       = require('../../../domain/conversation/entities/Conversation');
const Message            = require('../../../domain/conversation/entities/Message');
const ConversationStatus = require('../../../domain/conversation/value-objects/ConversationStatus');
const CustomerIdentified = require('../../../domain/customer/events/CustomerIdentified');
const MessageReceived    = require('../../../domain/conversation/events/MessageReceived');
const IntentType         = require('../../../shared/ai/IntentType');

const QUOTE_INTENTS          = new Set([IntentType.REQUEST_QUOTE, IntentType.PROVIDE_INFO]);
const REQUIRED_QUOTE_FIELDS  = ['productType', 'quantity'];

/**
 * Merges newly extracted data on top of previously accumulated data.
 * Non-null values in `next` override `prev`; null values in `next` are ignored
 * so a field extracted on turn 1 is never wiped by a null on turn 2.
 */
function mergeExtractedData(prev, next) {
  const merged = { ...(prev || {}) };
  for (const [key, value] of Object.entries(next || {})) {
    if (value !== null && value !== undefined) merged[key] = value;
  }
  return merged;
}

class HandleIncomingMessage {
  constructor({
    conversationRepository, customerRepository, messageRepository, eventBus,
    aiService             = null,
    searchProducts        = null,
    generateQuotationDraft = null,
    tenantRepository      = null,
  }) {
    this.conversationRepository  = conversationRepository;
    this.customerRepository      = customerRepository;
    this.messageRepository       = messageRepository;
    this.eventBus                = eventBus;
    this.aiService               = aiService;
    this.searchProducts          = searchProducts;
    this.generateQuotationDraft  = generateQuotationDraft;
    this.tenantRepository        = tenantRepository;
  }

  async execute({ tenantId, from, body, channel = 'WHATSAPP', externalId = null }) {
    // ── 1. Find or create customer ──────────────────────────
    let customer = await this.customerRepository.findByPhone(tenantId, from);
    const isNewCustomer = !customer;
    if (!customer) {
      customer = await this.customerRepository.save(
        new Customer({ tenantId, phone: from, source: channel, metadata: {} })
      );
      await this.eventBus.publish('CustomerIdentified', new CustomerIdentified({
        customerId: customer.id, tenantId, phone: from,
      }));
    }

    // ── 2. Find or open conversation ────────────────────────
    let conversation = await this.conversationRepository.findActiveByCustomer(tenantId, customer.id);
    if (!conversation) {
      conversation = await this.conversationRepository.save(
        new Conversation({
          tenantId, customerId: customer.id, channel,
          status: ConversationStatus.GATHERING_INFO, context: {},
        })
      );
    }

    // ── 3. Persist inbound message ──────────────────────────
    const savedMsg = await this.messageRepository.save(
      new Message({ tenantId, conversationId: conversation.id, direction: 'INBOUND', body, externalId })
    );

    // ── 4. Emit domain event ────────────────────────────────
    await this.eventBus.publish('MessageReceived', new MessageReceived({
      conversationId: conversation.id, tenantId,
      messageId: savedMsg.id, content: body, from,
    }));

    // ── 5. Storage-only mode ────────────────────────────────
    if (!this.aiService) {
      return {
        conversationId: conversation.id,
        messageId:      savedMsg.id,
        customerId:     customer.id,
        isNewCustomer,
        aiProcessed:    false,
      };
    }

    // ── 6. AI processing ────────────────────────────────────
    let aiResult = {};
    try {
      aiResult = await this._processWithAI(tenantId, customer.id, conversation);
      if (aiResult.updatedConversation) {
        await this.conversationRepository.save(aiResult.updatedConversation);
        delete aiResult.updatedConversation;
      }
    } catch (err) {
      console.error('[HandleIncomingMessage] AI processing error:', err.message);
      aiResult = { aiProcessed: false, aiError: err.message };
    }

    return {
      conversationId: conversation.id,
      messageId:      savedMsg.id,
      customerId:     customer.id,
      isNewCustomer,
      ...aiResult,
    };
  }

  async _processWithAI(tenantId, customerId, conversation) {
    const [messages, botConfig] = await Promise.all([
      this.messageRepository.findByConversation(tenantId, conversation.id),
      this.tenantRepository ? this.tenantRepository.getBotConfig(tenantId) : Promise.resolve({}),
    ]);

    const history = messages.map(m => ({
      role:    m.direction === 'INBOUND' ? 'user' : 'assistant',
      content: m.body,
    }));

    const intentResult = await this.aiService.extractIntent(history);

    // ── Accumulate: merge new extractedData over previously known fields ──
    const extractedData = mergeExtractedData(
      conversation.context?.extractedData,
      intentResult.extractedData,
    );

    // ── Recalculate from merged data — don't trust AI's missingFields alone ──
    const missingFields = REQUIRED_QUOTE_FIELDS.filter(f => !extractedData[f]);

    const context = {
      ...(conversation.context || {}),
      lastIntent:    intentResult.intent,
      confidence:    intentResult.confidence,
      extractedData,
      missingFields,
    };

    // Guard: quotation already pending — track new intent, no re-quote
    if (context.quotationId) {
      conversation.context = context;
      return {
        aiProcessed:      true,
        intent:           intentResult.intent,
        quotationPending: true,
        quotationId:      context.quotationId,
        updatedConversation: conversation,
      };
    }

    // Non-quoting intent — update context and return
    if (!QUOTE_INTENTS.has(intentResult.intent)) {
      conversation.context = context;
      return {
        aiProcessed: true,
        intent:      intentResult.intent,
        updatedConversation: conversation,
      };
    }

    // Still missing required fields — ask next question
    if (missingFields.length > 0) {
      const gatherResult     = await this.aiService.gatherRequirements(history, missingFields, botConfig);
      context.lastAIResponse = gatherResult.response;
      context.aiStage        = 'GATHERING_INFO';
      conversation.context   = context;
      return {
        aiProcessed:   true,
        intent:        intentResult.intent,
        missingFields,
        nextQuestion:  gatherResult.response,
        updatedConversation: conversation,
      };
    }

    // All required fields present — attempt catalog resolution
    const { productType, quantity } = extractedData;

    if (!productType || !quantity) {
      // Edge case: merged data still incomplete despite no missingFields
      context.aiStage      = 'GATHERING_INFO';
      context.lastAIResponse = null;
      conversation.context = context;
      return { aiProcessed: true, intent: intentResult.intent, updatedConversation: conversation };
    }

    const searchResults = await this.searchProducts.execute({
      tenantId,
      query:   productType,
      filters: { status: 'ACTIVE' },
    });

    context.catalogMatches = [{
      productType,
      quantity,
      matches: searchResults.map(p => ({ id: p.id, name: p.name, sku: p.sku, category: p.category })),
    }];

    const resolved = this._resolveSingleProduct(searchResults, productType);

    if (!resolved) {
      const reason = searchResults.length === 0 ? 'NO_MATCH' : 'AMBIGUOUS_MATCH';
      context.unresolvedItems = [{ productType, quantity, reason, matchCount: searchResults.length }];
      context.aiStage         = 'GATHERING_INFO';
      conversation.context    = context;
      return {
        aiProcessed:     true,
        intent:          intentResult.intent,
        unresolvedItems: context.unresolvedItems,
        catalogMatches:  context.catalogMatches,
        updatedConversation: conversation,
      };
    }

    const quotation = await this.generateQuotationDraft.execute({
      tenantId,
      customerId,
      conversationId: conversation.id,
      requestedItems: [{ productId: resolved.id, quantity: +quantity }],
    });

    context.quotationId      = quotation.id;
    context.aiStage          = 'QUOTED';
    context.unresolvedItems  = [];
    conversation.context     = context;
    conversation.status      = ConversationStatus.WAITING_APPROVAL;

    return {
      aiProcessed: true,
      intent:      intentResult.intent,
      quotationId: quotation.id,
      updatedConversation: conversation,
    };
  }

  _resolveSingleProduct(results, productType) {
    if (results.length === 0) return null;
    if (results.length === 1) return results[0];
    const query = productType.toLowerCase().trim();
    return results.find(p => p.name.toLowerCase().trim() === query) || null;
  }
}

module.exports = HandleIncomingMessage;
