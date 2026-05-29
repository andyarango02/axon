'use strict';

class ProcessApprovalDecision {
  constructor({ workflowExecutionRepository, quotationRepository, eventBus }) {
    this.workflowExecutionRepository = workflowExecutionRepository;
    this.quotationRepository = quotationRepository;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, approvalRequestId: string, decision: 'APPROVED'|'REJECTED', decidedBy: string, comment?: string }} input
   * @returns {Promise<void>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = ProcessApprovalDecision;
