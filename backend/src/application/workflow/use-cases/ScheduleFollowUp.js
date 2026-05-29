'use strict';

class ScheduleFollowUp {
  constructor({ workflowExecutionRepository, eventBus }) {
    this.workflowExecutionRepository = workflowExecutionRepository;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, resourceType: string, resourceId: string, scheduledFor: Date, assignedTo?: string, message?: string, scheduledBy: string }} input
   * @returns {Promise<void>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = ScheduleFollowUp;
