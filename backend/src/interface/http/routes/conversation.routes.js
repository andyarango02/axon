'use strict';

const { Router } = require('express');

function conversationRoutes({ conversationController, authMiddleware, tenantMiddleware }) {
  const router = Router();

  router.use(authMiddleware, tenantMiddleware);

  router.get('/',                (req, res, next) => conversationController.list(req, res, next));
  router.get('/:id',             (req, res, next) => conversationController.getById(req, res, next));
  router.get('/:id/history',     (req, res, next) => conversationController.getHistory(req, res, next));
  router.post('/:id/messages',   (req, res, next) => conversationController.sendMessage(req, res, next));

  return router;
}

module.exports = conversationRoutes;
