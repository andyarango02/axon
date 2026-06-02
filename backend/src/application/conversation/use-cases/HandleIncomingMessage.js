'use strict';

const Customer           = require('../../../domain/customer/entities/Customer');
const Conversation       = require('../../../domain/conversation/entities/Conversation');
const Message            = require('../../../domain/conversation/entities/Message');
const ConversationStatus = require('../../../domain/conversation/value-objects/ConversationStatus');
const CustomerIdentified = require('../../../domain/customer/events/CustomerIdentified');
const MessageReceived    = require('../../../domain/conversation/events/MessageReceived');
const IntentType         = require('../../../shared/ai/IntentType');

// Intents that are part of the quotation funnel
const QUOTE_INTENTS = new Set([IntentType.REQUEST_QUOTE, IntentType.PROVIDE_INFO]);

class HandleIncomingMessage {
  /**
   * @param {{
   *   conversationRepository, customerRepository, messageRepository, eventBus,
   *   aiService?: object|null,         — null → storage-only mode (no OPENAI_API_KEY)
   *   searchProducts?: object|null,    — SearchProducts use case
   *   generateQuotationDraft?: object|null — GenerateQuotationDraft use case
   * }} deps
   */
  constructor({
    conversationRepository, customerRepository, messageRepository, eventBus,
    aiService             = null,
    searchProducts        = null,
    generateQuotationDraft = null,
  }) {
    this.conversationRepository  = conversationRepository;
    this.customerRepository      = customerRepository;
    this.messageRepository       = messageRepository;
    this.eventBus                = eventBus;
    this.aiService               = aiService;
    this.searchProducts          = searchProducts;
    this.generateQuotationDraft  = generateQuotationDraft;
  }

  /**
   * @param {{ tenantId: string, from: string, body: string, channel?: string, externalId?: string }} input
   */
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

    // ── 5. Storage-only mode — no AI configured ─────────────
    if (!this.aiService) {
      return {
        conversationId: conversation.id,
        messageId:      savedMsg.id,
        customerId:     customer.id,
        isNewCustomer,
        aiProcessed:    false,
      };
    }

    // ── 6. AI processing — errors degrade gracefully ────────
    let aiResult = {};
    try {
      aiResult = await this._processWithAI(tenantId, customer.id, conversation);
      if (aiResult.updatedConversation) {
        await this.conversationRepository.save(aiResult.updatedConversation);
        delete aiResult.updatedConversation; // strip internal field from response
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

  // ── Private: AI orchestration ──────────────────────────────

  async _processWithAI(tenantId, customerId, conversation) {
    // Build conversation history for the AI context window
    const messages = await this.messageRepository.findByConversation(tenantId, conversation.id);
    const history  = messages.map(m => ({
      role:    m.direction === 'INBOUND' ? 'user' : 'assistant',
      content: m.body,
    }));

    // Extract intent from full history
    const intentResult = await this.aiService.extractIntent(history);

    // Merge AI result into conversation context (preserve existing fields)
    const context = {
      ...(conversation.context || {}),
      lastIntent:    intentResult.intent,
      confidence:    intentResult.confidence,
      extractedData: intentResult.extractedData,
      missingFields: intentResult.missingFields,
    };

    // Guard: quotation already pending — just track new intent, no re-quote
    if (context.quotationId) {
      conversation.context = context;
      return {
        aiProcessed:    true,
        intent:         intentResult.intent,
        quotationPending: true,
        quotationId:    context.quotationId,
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

    // Quote intent but missing required fields — ask next question
    if (intentResult.missingFields.length > 0) {
      const gatherResult         = await this.aiService.gatherRequirements(history, intentResult.missingFields);
      context.lastAIResponse     = gatherResult.response;
      context.aiStage            = 'GATHERING_INFO';
      conversation.context       = context;
      return {
        aiProcessed:   true,
        intent:        intentResult.intent,
        missingFields: intentResult.missingFields,
        nextQuestion:  gatherResult.response,
        updatedConversation: conversation,
      };
    }

    // All required fields present — attempt catalog resolution
    const { productType, quantity } = intentResult.extractedData;

    if (!productType || !quantity) {
      // Edge case: AI flagged no missing fields but extractedData is still incomplete
      context.aiStage      = 'GATHERING_INFO';
      context.lastAIResponse = null;
      conversation.context = context;
      return { aiProcessed: true, intent: intentResult.intent, updatedConversation: conversation };
    }

    // Search catalog using SearchProducts use case
    const searchResults = await this.searchProducts.execute({
      tenantId,
      query:   productType,
      filters: { status: 'ACTIVE' },
    });

    // Record all catalog matches for traceability
    context.catalogMatches = [{
      productType,
      quantity,
      matches: searchResults.map(p => ({ id: p.id, name: p.name, sku: p.sku, category: p.category })),
    }];

    // Resolve: 0 → no match | 1 → clear | 2+ → check exact name | else ambiguous
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

    // Product resolved — generate quotation
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

  /**
   * Returns the single matching product, or null if the match is ambiguous.
   * - 0 results → null (no match)
   * - 1 result  → return it (clear match)
   * - 2+ results → exact name match wins; otherwise null (ambiguous)
   */
  _resolveSingleProduct(results, productType) {
    if (results.length === 0) return null;
    if (results.length === 1) return results[0];
    const query = productType.toLowerCase().trim();
    return results.find(p => p.name.toLowerCase().trim() === query) || null;
  }
}

module.exports = HandleIncomingMessage;
