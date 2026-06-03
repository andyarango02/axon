'use strict';

const config = require('../../../shared/config');

/**
 * Validates the X-Twilio-Signature header for inbound Twilio webhooks.
 *
 * Passthrough rules (in order):
 *  1. TWILIO_SKIP_SIGNATURE_VALIDATION=true  → always skip (dev/testing)
 *  2. No X-Twilio-Signature header           → internal request (curl/backend), skip
 *  3. Signature present but no TWILIO_AUTH_TOKEN:
 *       - development → warn + skip
 *       - production  → 500 (misconfiguration)
 *  4. Signature present but no WEBHOOK_BASE_URL → warn + skip
 *  5. Signature present + both vars set         → validate; 403 on mismatch
 */
function validateTwilioSignature(req, res, next) {
  if (config.twilio.skipSignatureValidation) return next();

  const signature = req.headers['x-twilio-signature'];

  // No signature → internal request, not from Twilio
  if (!signature) return next();

  if (!config.twilio.authToken) {
    if (config.nodeEnv !== 'production') {
      console.warn('[webhook] X-Twilio-Signature present but TWILIO_AUTH_TOKEN not set — skipping validation');
      return next();
    }
    return res.status(500).json({ error: 'TWILIO_AUTH_TOKEN not configured' });
  }

  if (!config.webhookBaseUrl) {
    console.warn('[webhook] X-Twilio-Signature present but WEBHOOK_BASE_URL not set — skipping validation');
    return next();
  }

  const twilio = require('twilio');
  const url    = `${config.webhookBaseUrl}/webhooks/whatsapp`;
  const valid  = twilio.validateRequest(config.twilio.authToken, signature, url, req.body);

  if (!valid) return res.status(403).json({ error: 'Invalid Twilio signature' });
  next();
}

module.exports = validateTwilioSignature;
