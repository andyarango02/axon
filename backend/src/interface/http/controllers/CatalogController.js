'use strict';

class CatalogController {
  constructor(useCases) {
    this.uc = useCases;
  }

  // ── Products ───────────────────────────────────────────────

  async listProducts(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const { query = '', ...filters } = req.query;
      res.json(await this.uc.searchProducts.execute({ tenantId, query, filters }));
    } catch (err) { next(err); }
  }

  async createProduct(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      res.status(201).json(await this.uc.createProduct.execute({ tenantId, ...req.body }));
    } catch (err) { next(err); }
  }

  async updateProduct(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const { updatedBy, ...changes } = req.body;
      res.json(await this.uc.updateProduct.execute({
        tenantId, productId: req.params.id, changes, updatedBy: updatedBy || req.user?.id || null,
      }));
    } catch (err) { next(err); }
  }

  async deleteProduct(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      await this.uc.deleteProduct.execute({
        tenantId, productId: req.params.id, deletedBy: req.user?.id || null,
      });
      res.status(204).end();
    } catch (err) { next(err); }
  }

  async getPrice(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const { quantity, priceListId } = req.query;
      if (!quantity) return res.status(400).json({ error: 'quantity is required' });
      res.json(await this.uc.getPriceForProduct.execute({
        tenantId, productId: req.params.id, quantity: +quantity, priceListId: priceListId || null,
      }));
    } catch (err) { next(err); }
  }

  // ── Pricing rules ──────────────────────────────────────────

  async listPricingRules(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const { productId, priceListId, category } = req.query;
      res.json(await this.uc.listPricingRules.execute({ tenantId, productId, priceListId, category }));
    } catch (err) { next(err); }
  }

  async createPricingRule(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      res.status(201).json(await this.uc.createPricingRule.execute({ tenantId, ...req.body }));
    } catch (err) { next(err); }
  }

  async getPricingRule(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      res.json(await this.uc.getPricingRule.execute({ tenantId, ruleId: req.params.id }));
    } catch (err) { next(err); }
  }

  async updatePricingRule(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const { updatedBy, ...changes } = req.body;
      res.json(await this.uc.updatePricingRule.execute({
        tenantId, ruleId: req.params.id, changes, updatedBy: updatedBy || req.user?.id || null,
      }));
    } catch (err) { next(err); }
  }

  async deletePricingRule(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      await this.uc.deletePricingRule.execute({
        tenantId, ruleId: req.params.id, deletedBy: req.user?.id || null,
      });
      res.status(204).end();
    } catch (err) { next(err); }
  }

  // ── Price lists ────────────────────────────────────────────

  async listPriceLists(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      res.json(await this.uc.listPriceLists.execute({ tenantId }));
    } catch (err) { next(err); }
  }

  async createPriceList(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      res.status(201).json(await this.uc.createPriceList.execute({ tenantId, ...req.body }));
    } catch (err) { next(err); }
  }

  async updatePriceList(req, res, next) {
    try {
      const tenantId = req.tenantId;
      if (!tenantId) return res.status(400).json({ error: 'tenantId is required' });
      const { executedBy, ...changes } = req.body;
      res.json(await this.uc.managePriceList.execute({
        tenantId, priceListId: req.params.id, changes, executedBy: executedBy || req.user?.id || null,
      }));
    } catch (err) { next(err); }
  }
}

module.exports = CatalogController;
