'use strict';

const QuotationStatus = require('../../../domain/quotation/value-objects/QuotationStatus');
const Message         = require('../../../domain/conversation/entities/Message');
const NotFoundError   = require('../../../shared/errors/NotFoundError');
const DomainError     = require('../../../shared/errors/DomainError');

class SendQuotation {
  constructor({
    quotationRepository,
    customerRepository,
    messageRepository,
    messagingService,
    pdfGenerator,
  }) {
    this.quotationRepository = quotationRepository;
    this.customerRepository  = customerRepository;
    this.messageRepository   = messageRepository;
    this.messagingService    = messagingService;
    this.pdfGenerator        = pdfGenerator;
  }

  async execute({ tenantId, quotationId, sentBy = null }) {
    if (!this.messagingService) {
      throw new DomainError('Messaging service not configured', 'SERVICE_UNAVAILABLE');
    }

    const quotation = await this.quotationRepository.findById(tenantId, quotationId);
    if (!quotation) throw new NotFoundError('Quotation', quotationId);

    if (quotation.status !== QuotationStatus.APPROVED) {
      throw new DomainError(
        `Cannot send quotation in status ${quotation.status}. Approve it first.`,
        'INVALID_STATUS',
      );
    }

    const customer = await this.customerRepository.findById(tenantId, quotation.customerId);
    if (!customer?.phone) {
      throw new DomainError('Customer has no phone number on record', 'MISSING_PHONE');
    }

    // Generate PDF — non-blocking: failure shouldn't stop the send
    let pdfGenerated = false;
    try {
      await this.pdfGenerator.generate(quotation, customer);
      pdfGenerated = true;
    } catch (err) {
      console.error('[SendQuotation] PDF generation failed:', err.message);
    }

    // Build WhatsApp text body
    // Media (PDF) requires a publicly accessible URL — wire when backend is deployed.
    const body = this._buildMessage(quotation);

    let sent             = false;
    let whatsappMessageId = null;
    let sendError        = null;

    try {
      const result = await this.messagingService.sendMessage({ to: customer.phone, body, tenantId });
      whatsappMessageId = result.messageId || null;
      sent = true;
    } catch (err) {
      console.error('[SendQuotation] Twilio error:', err.message);
      sendError = err.message;
      return { sent: false, pdfGenerated, sendError, quotation };
    }

    // Persist outbound message when a conversation exists
    if (quotation.conversationId) {
      this.messageRepository.save(new Message({
        tenantId,
        conversationId: quotation.conversationId,
        direction:      'OUTBOUND',
        body,
        externalId:     whatsappMessageId,
        createdBy:      sentBy,
      })).catch(err =>
        console.error('[SendQuotation] failed to persist outbound message:', err.message)
      );
    }

    // Status change to SENT deferred — will wire after PDF media delivery is confirmed.
    return { sent, pdfGenerated, mediaNotSent: true, whatsappMessageId, quotation };
  }

  _buildMessage(q) {
    const lines = q.items.map(i => `• ${i.description} x${i.quantity}`).join('\n');
    return (
      `Hola, ya tenemos lista tu propuesta:\n\n${lines}\n\n` +
      `Total: ${q.currency} ${q.total.toFixed(2)}\n\n` +
      `En breve te enviamos el PDF completo. Respondé si querés avanzar o tenés dudas.`
    );
  }
}

module.exports = SendQuotation;
