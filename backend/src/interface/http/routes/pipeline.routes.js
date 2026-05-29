'use strict';

const { Router } = require('express');

function pipelineRoutes({ pipelineController, authMiddleware, tenantMiddleware }) {
  const router = Router();

  router.use(authMiddleware, tenantMiddleware);

  router.get('/board',            (req, res, next) => pipelineController.getBoard(req, res, next));
  router.post('/',                (req, res, next) => pipelineController.create(req, res, next));
  router.patch('/:id/stage',      (req, res, next) => pipelineController.moveStage(req, res, next));

  return router;
}

module.exports = pipelineRoutes;
