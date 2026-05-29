'use strict';

class WebhookController {
  constructor({ handleIncomingMessage }) {
    this.handleIncomingMessage = handleIncomingMessage;
  }

  async handleWhatsApp(req, res, next) {
    try {
      const { tenantId, from, body, channel, externalId } = req.body;

      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      if (!from)     return res.status(400).json({ error: 'from is required' });
      if (!body)     return res.status(400).json({ error: 'body is required' });

      const result = await this.handleIncomingMessage.execute({
        tenantId,
        from,
        body,
        channel:    channel    || 'WHATSAPP',
        externalId: externalId || null,
      });

      res.status(200).json({ ok: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = WebhookController;
