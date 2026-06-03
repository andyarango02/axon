'use strict';

const { Router } = require('express');

function settingsRoutes({ settingsController, authMiddleware, tenantMiddleware }) {
  const router = Router();

  router.use(authMiddleware, tenantMiddleware);

  router.get('/bot',  (req, res, next) => settingsController.getBotSettings(req, res, next));
  router.put('/bot',  (req, res, next) => settingsController.updateBotSettings(req, res, next));

  return router;
}

module.exports = settingsRoutes;
