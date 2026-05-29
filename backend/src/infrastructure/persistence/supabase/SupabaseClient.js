'use strict';

const { createClient } = require('@supabase/supabase-js');
const config = require('../../../shared/config');

let client = null;

function getSupabaseClient() {
  if (client) return client;

  const { url, serviceRoleKey } = config.supabase;

  if (!url)            throw new Error('Missing required environment variable: SUPABASE_URL');
  if (!serviceRoleKey) throw new Error('Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY');

  // serviceRoleKey bypasses Row Level Security — required for all server-side DB operations.
  // Never expose this key to browser clients.
  client = createClient(url, serviceRoleKey);
  return client;
}

module.exports = { getSupabaseClient };
