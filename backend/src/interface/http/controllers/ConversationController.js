'use strict';

class ConversationController {
  constructor({ getConversationHistory }) {
    this.getConversationHistory = getConversationHistory;
  }

  async getHistory(req, res, next) {
    try {
      const { tenantId, limit, offset } = req.query;
      const conversationId = req.params.id;

      if (!tenantId) return res.status(400).json({ error: 'tenantId query param is required' });

      const result = await this.getConversationHistory.execute({
        tenantId,
        conversationId,
        limit:  limit  ? parseInt(limit,  10) : 50,
        offset: offset ? parseInt(offset, 10) : 0,
      });

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ConversationController;
