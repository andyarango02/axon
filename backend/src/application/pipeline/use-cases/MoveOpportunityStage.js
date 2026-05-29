'use strict';

class MoveOpportunityStage {
  constructor({ opportunityRepository, eventBus }) {
    this.opportunityRepository = opportunityRepository;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, opportunityId: string, toStage: string, movedBy: string }} input
   * @returns {Promise<void>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = MoveOpportunityStage;
