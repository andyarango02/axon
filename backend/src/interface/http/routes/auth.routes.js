'use strict';

const { Router } = require('express');

function authRoutes({ authController, authMiddleware, tenantMiddleware }) {
  const router = Router();

  // Profile — only needs the JWT, not a resolved tenant
  // (this endpoint IS how the frontend learns its tenantId)
  router.get('/me',
    authMiddleware,
    (req, res, next) => authController.getMe(req, res, next)
  );

  // Login / refresh / logout are handled client-side by @supabase/supabase-js
  const sdkOnly = (req, res) =>
    res.status(501).json({ error: 'Use the Supabase client SDK for auth operations' });

  router.post('/login',   sdkOnly);
  router.post('/refresh', sdkOnly);
  router.post('/logout',  sdkOnly);

  return router;
}

module.exports = authRoutes;
