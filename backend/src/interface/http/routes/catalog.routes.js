'use strict';

const { Router } = require('express');

function catalogRoutes({ catalogController, authMiddleware, tenantMiddleware }) {
  const router = Router();

  router.use(authMiddleware, tenantMiddleware);

  // ── Products ─────────────────────────────────────────────
  router.get   ('/products',            (req, res, next) => catalogController.listProducts(req, res, next));
  router.post  ('/products',            (req, res, next) => catalogController.createProduct(req, res, next));
  router.patch ('/products/:id',        (req, res, next) => catalogController.updateProduct(req, res, next));
  router.delete('/products/:id',        (req, res, next) => catalogController.deleteProduct(req, res, next));
  router.get   ('/products/:id/price',  (req, res, next) => catalogController.getPrice(req, res, next));

  // ── Pricing rules ─────────────────────────────────────────
  router.get   ('/pricing-rules',       (req, res, next) => catalogController.listPricingRules(req, res, next));
  router.post  ('/pricing-rules',       (req, res, next) => catalogController.createPricingRule(req, res, next));
  router.get   ('/pricing-rules/:id',   (req, res, next) => catalogController.getPricingRule(req, res, next));
  router.patch ('/pricing-rules/:id',   (req, res, next) => catalogController.updatePricingRule(req, res, next));
  router.delete('/pricing-rules/:id',   (req, res, next) => catalogController.deletePricingRule(req, res, next));

  // ── Price lists ───────────────────────────────────────────
  router.get   ('/price-lists',         (req, res, next) => catalogController.listPriceLists(req, res, next));
  router.post  ('/price-lists',         (req, res, next) => catalogController.createPriceList(req, res, next));
  router.patch ('/price-lists/:id',     (req, res, next) => catalogController.updatePriceList(req, res, next));

  return router;
}

module.exports = catalogRoutes;
