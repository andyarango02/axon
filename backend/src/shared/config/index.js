'use strict';

require('dotenv').config();

const config = {
  port:    process.env.PORT    || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  supabase: {
    url:            process.env.SUPABASE_URL,
    anonKey:        process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model:  process.env.OPENAI_MODEL || 'gpt-4o',
  },

  twilio: {
    accountSid:    process.env.TWILIO_ACCOUNT_SID,
    authToken:     process.env.TWILIO_AUTH_TOKEN,
    whatsappFrom:  process.env.TWILIO_WHATSAPP_FROM,
  },

  jwt: {
    secret:    process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};

module.exports = config;
