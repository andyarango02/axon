'use strict';

const { Router } = require('express');

function catalogRoutes({ catalogController, authMiddleware, tenantMiddleware }) {
  const router = Router();

  router.use(authMiddleware, tenantMiddleware);

  router.get('/products',           (req, res, next) => catalogController.listProducts(req, res, next));
  router.post('/products',          (req, res, next) => catalogController.createProduct(req, res, next));
  router.patch('/products/:id',     (req, res, next) => catalogController.updateProduct(req, res, next));
  router.delete('/products/:id',    (req, res, next) => catalogController.deleteProduct(req, res, next));
  router.get('/pricing-rules',      (req, res, next) => catalogController.listPricingRules(req, res, next));
  router.post('/pricing-rules',     (req, res, next) => catalogController.managePricingRules(req, res, next));

  return router;
}

module.exports = catalogRoutes;
