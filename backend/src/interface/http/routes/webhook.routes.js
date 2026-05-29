'use strict';

const { Router } = require('express');

function webhookRoutes({ webhookController, validateTwilioSignature }) {
  const router = Router();

  router.post('/whatsapp', validateTwilioSignature, (req, res, next) =>
    webhookController.handleWhatsApp(req, res, next)
  );

  return router;
}

module.exports = webhookRoutes;
