'use strict';

const IMessagingService = require('../../../application/ports/IMessagingService');

class TwilioWhatsAppService extends IMessagingService {
  constructor(twilioClient, config) {
    super();
    this.client = twilioClient;
    this.config = config;
  }

  async sendMessage({ to, body, tenantId }) {
    throw new Error('Not implemented');
  }

  async sendTemplate({ to, templateName, variables, tenantId }) {
    throw new Error('Not implemented');
  }
}

module.exports = TwilioWhatsAppService;
