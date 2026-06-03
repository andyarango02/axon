'use strict';

const { Router } = require('express');

function quotationRoutes({ quotationController, authMiddleware, tenantMiddleware }) {
  const router = Router();

  router.use(authMiddleware, tenantMiddleware);

  router.post('/',         (req, res, next) => quotationController.generate(req, res, next));
  router.get('/',          (req, res, next) => quotationController.list(req, res, next));
  router.get('/:id',       (req, res, next) => quotationController.getById(req, res, next));
  router.get('/:id/pdf',   (req, res, next) => quotationController.getPDF(req, res, next));
  router.patch('/:id',     (req, res, next) => quotationController.edit(req, res, next));
  router.post('/:id/approve', (req, res, next) => quotationController.approve(req, res, next));
  router.post('/:id/reject',  (req, res, next) => quotationController.reject(req, res, next));
  router.post('/:id/send',    (req, res, next) => quotationController.send(req, res, next));

  return router;
}

module.exports = quotationRoutes;
