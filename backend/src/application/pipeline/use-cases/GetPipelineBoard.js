'use strict';

class GetPipelineBoard {
  constructor({ opportunityRepository }) {
    this.opportunityRepository = opportunityRepository;
  }

  /**
   * @param {{ tenantId: string, assignedTo?: string }} input
   * @returns {Promise<Record<string, object[]>>}
   */
  async execute(input) {
    throw new Error('Not implemented');
  }
}

module.exports = GetPipelineBoard;
