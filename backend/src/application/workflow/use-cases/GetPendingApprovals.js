'use strict';

class GetPendingApprovals {
  constructor({ workflowExecutionRepository }) {
    this.workflowExecutionRepository = workflowExecutionRepository;
  }

  /**
   * @param {{ tenantId: string, assignedTo?: string }} input
   * @returns {Promise<object[]>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = GetPendingApprovals;
