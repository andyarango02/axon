'use strict';

const { createClient } = require('@supabase/supabase-js');
const config = require('../../../shared/config');

let client = null;

function getSupabaseClient() {
  if (client) return client;

  const { url, anonKey } = config.supabase;

  if (!url)     throw new Error('Missing required environment variable: SUPABASE_URL');
  if (!anonKey) throw new Error('Missing required environment variable: SUPABASE_ANON_KEY');

  client = createClient(url, anonKey);
  return client;
}

module.exports = { getSupabaseClient };
