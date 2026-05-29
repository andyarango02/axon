'use strict';

const { Router } = require('express');

function workflowRoutes({ workflowController, authMiddleware, tenantMiddleware }) {
  const router = Router();

  router.use(authMiddleware, tenantMiddleware);

  router.get('/approvals/pending',          (req, res, next) => workflowController.getPendingApprovals(req, res, next));
  router.post('/approvals/:id/decision',    (req, res, next) => workflowController.processDecision(req, res, next));
  router.post('/follow-ups',                (req, res, next) => workflowController.scheduleFollowUp(req, res, next));

  return router;
}

module.exports = workflowRoutes;
