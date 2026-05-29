'use strict';

class TriggerApprovalWorkflow {
  constructor({ workflowDefinitionRepository, workflowExecutionRepository, eventBus }) {
    this.workflowDefinitionRepository = workflowDefinitionRepository;
    this.workflowExecutionRepository = workflowExecutionRepository;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, triggerEvent: string, resourceType: string, resourceId: string, triggeredBy: string }} input
   * @returns {Promise<import('../../../domain/workflow/entities/WorkflowExecution')>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = TriggerApprovalWorkflow;
