'use strict';

// Requires: npm install twilio
const config = require('../../../shared/config');

let client = null;

function getTwilioClient() {
  if (!client) {
    const twilio = require('twilio');
    client = twilio(config.twilio.accountSid, config.twilio.authToken);
  }
  return client;
}

module.exports = { getTwilioClient };
