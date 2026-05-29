'use strict';

// Requires: npm install openai
const config = require('../../../shared/config');

let client = null;

function getOpenAIClient() {
  if (!client) {
    const OpenAI = require('openai');
    client = new OpenAI({ apiKey: config.openai.apiKey });
  }
  return client;
}

module.exports = { getOpenAIClient };
