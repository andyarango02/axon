'use strict';

// Validates that the inbound request genuinely originated from Twilio
// by verifying the X-Twilio-Signature header against the request URL and body.
// Requires: npm install twilio
function validateTwilioSignature(req, res, next) {
  throw new Error('Not implemented');
}

module.exports = validateTwilioSignature;
