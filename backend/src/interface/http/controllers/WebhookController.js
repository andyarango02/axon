'use strict';

const config  = require('../../../shared/config');
const Message = require('../../../domain/conversation/entities/Message');

const QUOTATION_PENDING_MSG =
  'Gracias. Ya generamos una cotización preliminar y quedó pendiente de revisión. En breve te la enviaremos.';

class WebhookController {
  constructor({ handleIncomingMessage, messagingService = null, messageRepository = null }) {
    this.handleIncomingMessage = handleIncomingMessage;
    this.messagingService      = messagingService;
    this.messageRepository     = messageRepository;
  }

  async handleWhatsApp(req, res, next) {
    try {
      const isTwilio = !!req.body.From;
      let tenantId, from, body, channel, externalId, mediaUrl;

      if (isTwilio) {
        from       = (req.body.From || '').replace(/^whatsapp:/i, '');
        body       = req.body.Body       || '';
        externalId = req.body.MessageSid || null;
        channel    = 'WHATSAPP';
        mediaUrl   = Number(req.body.NumMedia) > 0 ? (req.body.MediaUrl0 || null) : null;
        tenantId   = req.query.tenantId || req.body.tenantId || config.defaultTenantId;
      } else {
        tenantId   = req.query.tenantId  || req.body.tenantId  || config.defaultTenantId;
        from       = req.body.from;
        body       = req.body.body;
        channel    = req.body.channel    || 'WHATSAPP';
        externalId = req.body.externalId || null;
        mediaUrl   = req.body.mediaUrl   || null;
      }

      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      if (!from)     return res.status(400).json({ error: 'from is required' });
      if (!body)     return res.status(400).json({ error: 'body is required' });

      const result = await this.handleIncomingMessage.execute({
        tenantId, from, body, channel, externalId,
      });

      // ── Outbound: only for real Twilio messages ──────────────
      let outboundSent  = false;
      let outboundError = null;

      if (isTwilio && this.messagingService) {
        const replyText = this._buildReply(result);

        if (replyText) {
          try {
            const { messageId } = await this.messagingService.sendMessage({
              to: from, body: replyText, tenantId,
            });

            outboundSent = true;

            // Persist the outbound message so the timeline is complete
            if (this.messageRepository && result.conversationId) {
              await this.messageRepository.save(new Message({
                tenantId,
                conversationId: result.conversationId,
                direction:      'OUTBOUND',
                body:           replyText,
                externalId:     messageId || null,
                createdBy:      null, // bot messages have no user — null avoids UUID FK violation
              })).catch(err =>
                console.error('[webhook] failed to persist outbound message:', err.message)
              );
            }
          } catch (err) {
            console.error('[webhook] outbound message failed:', err.message);
            outboundError = err.message;
          }
        }
      }

      res.status(200).json({
        ok: true,
        source: isTwilio ? 'twilio' : 'internal',
        outboundSent,
        ...(outboundError && { outboundError }),
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  _buildReply(result) {
    if (!result.aiProcessed) return null;
    if (result.nextQuestion)                           return result.nextQuestion;
    if (result.quotationId || result.quotationPending) return QUOTATION_PENDING_MSG;
    return null;
  }
}

module.exports = WebhookController;
