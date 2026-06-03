'use strict';

const IMessagingService = require('../../../application/ports/IMessagingService');

class TwilioWhatsAppService extends IMessagingService {
  constructor(twilioClient, config) {
    super();
    this.client = twilioClient;
    this.config = config; // { whatsappFrom: 'whatsapp:+14155238886' }
  }

  /**
   * @param {{ to: string, body: string, tenantId?: string }} options
   * to may or may not have the 'whatsapp:' prefix — we normalise it here.
   */
  async sendMessage({ to, body }) {
    const toFormatted   = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    const fromFormatted = this.config.whatsappFrom;

    const message = await this.client.messages.create({
      from: fromFormatted,
      to:   toFormatted,
      body,
    });

    return { messageId: message.sid };
  }

  async sendTemplate({ to, templateName, variables, tenantId }) {
    throw new Error('Not implemented');
  }
}

module.exports = TwilioWhatsAppService;
