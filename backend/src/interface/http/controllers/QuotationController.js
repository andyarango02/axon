'use strict';

class QuotationController {
  constructor(useCases) {
    this.uc = useCases;
  }

  async generate(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const quotation = await this.uc.generateQuotationDraft.execute({ tenantId, ...req.body });
      res.status(201).json(quotation);
    } catch (err) { next(err); }
  }

  async list(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const { status, customerId, conversationId } = req.query;
      const result = await this.uc.listQuotations.execute({
        tenantId,
        filters: { status, customerId, conversationId },
      });
      res.json(result);
    } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const quotation = await this.uc.getQuotationById.execute({
        tenantId, quotationId: req.params.id,
      });
      res.json(quotation);
    } catch (err) { next(err); }
  }

  async approve(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const quotation = await this.uc.approveQuotation.execute({
        tenantId,
        quotationId: req.params.id,
        approvedBy:  req.user?.id || null,
      });
      res.json(quotation);
    } catch (err) { next(err); }
  }

  async reject(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const { reason } = req.body;
      const quotation = await this.uc.rejectQuotation.execute({
        tenantId,
        quotationId: req.params.id,
        rejectedBy:  req.user?.id || null,
        reason,
      });
      res.json(quotation);
    } catch (err) { next(err); }
  }

  async getPDF(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const { buffer, filename } = await this.uc.getQuotationPDF.execute({
        tenantId,
        quotationId: req.params.id,
      });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length);
      res.send(buffer);
    } catch (err) { next(err); }
  }

  async edit(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const quotation = await this.uc.editQuotation.execute({
        tenantId,
        quotationId: req.params.id,
        items:       req.body.items || [],
        updatedBy:   req.user?.id  || null,
      });
      res.json(quotation);
    } catch (err) { next(err); }
  }

  async send(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const result = await this.uc.sendQuotation.execute({
        tenantId,
        quotationId: req.params.id,
        sentBy:      req.user?.id || null,
      });
      // sendQuotation returns sent:false without throwing when Twilio fails — always 200
      res.json(result);
    } catch (err) { next(err); }
  }
}

module.exports = QuotationController;
