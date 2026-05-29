'use strict';

const express = require('express');
const config = require('../shared/config');
const { getSupabaseClient } = require('../infrastructure/persistence/supabase/SupabaseClient');

function createApp(dependencies) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.get('/health/db', async (req, res) => {
    let db;
    try {
      db = getSupabaseClient();
    } catch {
      return res.status(503).json({ status: 'error', db: 'misconfigured' });
    }

    const { data, error } = await db
      .from('health_check')
      .select('id, status')
      .eq('id', 1)
      .limit(1);

    if (error) {
      return res.status(503).json({ status: 'error', db: 'query_failed', code: error.code, message: error.message });
    }

    if (data?.[0]?.status === 'ok') {
      return res.json({ status: 'ok', db: 'connected' });
    }

    return res.status(503).json({ status: 'error', db: 'unhealthy' });
  });

  app.use('/webhooks',             dependencies.webhookRoutes);
  app.use('/api/v1/auth',          dependencies.authRoutes);
  app.use('/api/v1/quotations',    dependencies.quotationRoutes);
  app.use('/api/v1/pipeline',      dependencies.pipelineRoutes);
  app.use('/api/v1/conversations', dependencies.conversationRoutes);
  app.use('/api/v1/catalog',       dependencies.catalogRoutes);
  app.use('/api/v1/workflow',      dependencies.workflowRoutes);

  app.use(dependencies.errorHandler);

  return app;
}

module.exports = { createApp };
