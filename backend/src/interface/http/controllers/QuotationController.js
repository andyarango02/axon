'use strict';

class QuotationController {
  // Use cases stored under this.uc to avoid name collisions with HTTP handler methods.
  constructor(useCases) {
    this.uc = useCases;
  }

  async generate(req, res, next) {
    try {
      const { tenantId, ...rest } = req.body;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const quotation = await this.uc.generateQuotationDraft.execute({ tenantId, ...rest });
      res.status(201).json(quotation);
    } catch (err) { next(err); }
  }

  async list(req, res, next) {
    try {
      const { tenantId, status, customerId, conversationId } = req.query;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const result = await this.uc.listQuotations.execute({
        tenantId,
        filters: { status, customerId, conversationId },
      });
      res.json(result);
    } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try {
      const { tenantId } = req.query;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const quotation = await this.uc.getQuotationById.execute({
        tenantId, quotationId: req.params.id,
      });
      res.json(quotation);
    } catch (err) { next(err); }
  }

  async approve(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) { next(err); }
  }

  async reject(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) { next(err); }
  }

  async send(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) { next(err); }
  }
}

module.exports = QuotationController;
