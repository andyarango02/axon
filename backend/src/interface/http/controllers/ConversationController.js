'use strict';

class ConversationController {
  constructor({ getConversationHistory }) {
    this.getConversationHistory = getConversationHistory;
  }

  async getHistory(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ConversationController;
