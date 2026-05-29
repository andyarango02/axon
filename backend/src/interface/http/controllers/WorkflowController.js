'use strict';

class WorkflowController {
  constructor({ getPendingApprovals, processApprovalDecision, scheduleFollowUp }) {
    this.getPendingApprovals = getPendingApprovals;
    this.processApprovalDecision = processApprovalDecision;
    this.scheduleFollowUp = scheduleFollowUp;
  }

  async getPendingApprovals(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }

  async processDecision(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }

  async scheduleFollowUp(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = WorkflowController;
