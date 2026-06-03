'use strict';

class ConversationController {
  constructor({ getConversationHistory, listConversations, sendHumanMessage }) {
    this.getConversationHistory = getConversationHistory;
    this.listConversations      = listConversations;
    this.sendHumanMessage       = sendHumanMessage;
  }

  async list(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const { status, customerId } = req.query;
      const result = await this.listConversations.execute({
        tenantId,
        filters: { status, customerId },
      });
      res.status(200).json(result);
    } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const { limit, offset } = req.query;
      const { conversation, messages } = await this.getConversationHistory.execute({
        tenantId,
        conversationId: req.params.id,
        limit:  limit  ? parseInt(limit,  10) : 50,
        offset: offset ? parseInt(offset, 10) : 0,
      });
      res.status(200).json({ ...conversation, messages });
    } catch (err) { next(err); }
  }

  async getHistory(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const { limit, offset } = req.query;
      const result = await this.getConversationHistory.execute({
        tenantId,
        conversationId: req.params.id,
        limit:  limit  ? parseInt(limit,  10) : 50,
        offset: offset ? parseInt(offset, 10) : 0,
      });
      res.status(200).json(result);
    } catch (err) { next(err); }
  }

  async sendMessage(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const { body } = req.body;
      if (!body || !body.trim()) return res.status(400).json({ error: 'body is required' });
      const result = await this.sendHumanMessage.execute({
        tenantId,
        conversationId: req.params.id,
        body:    body.trim(),
        agentId: req.user?.id || null,
      });
      res.status(201).json(result);
    } catch (err) { next(err); }
  }
}

module.exports = ConversationController;
