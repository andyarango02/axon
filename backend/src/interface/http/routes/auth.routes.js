'use strict';

const { Router } = require('express');

function authRoutes({ authController }) {
  const router = Router();

  router.post('/login',   (req, res, next) => authController.login(req, res, next));
  router.post('/refresh', (req, res, next) => authController.refresh(req, res, next));
  router.post('/logout',  (req, res, next) => authController.logout(req, res, next));

  return router;
}

module.exports = authRoutes;
