'use strict';

class PipelineController {
  constructor({ getPipelineBoard, createOpportunity, moveOpportunityStage }) {
    this.getPipelineBoard = getPipelineBoard;
    this.createOpportunity = createOpportunity;
    this.moveOpportunityStage = moveOpportunityStage;
  }

  async getBoard(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }

  async moveStage(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PipelineController;
