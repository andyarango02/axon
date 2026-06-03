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

  defaultTenantId: process.env.DEFAULT_TENANT_ID  || null,
  webhookBaseUrl:  process.env.WEBHOOK_BASE_URL   || null,

  twilio: {
    accountSid:               process.env.TWILIO_ACCOUNT_SID,
    authToken:                process.env.TWILIO_AUTH_TOKEN,
    whatsappFrom:             process.env.TWILIO_WHATSAPP_FROM,
    skipSignatureValidation:  process.env.TWILIO_SKIP_SIGNATURE_VALIDATION === 'true',
  },

  jwt: {
    secret:    process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};

module.exports = config;
