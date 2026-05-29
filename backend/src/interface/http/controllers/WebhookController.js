'use strict';

class WebhookController {
  constructor({ handleIncomingMessage }) {
    this.handleIncomingMessage = handleIncomingMessage;
  }

  async handleWhatsApp(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = WebhookController;
