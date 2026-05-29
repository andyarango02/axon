'use strict';

const { Router } = require('express');

function conversationRoutes({ conversationController, authMiddleware, tenantMiddleware }) {
  const router = Router();

  router.use(authMiddleware, tenantMiddleware);

  router.get('/:id/history', (req, res, next) => conversationController.getHistory(req, res, next));

  return router;
}

module.exports = conversationRoutes;
