'use strict';

class OpportunityStageChanged {
  constructor({ opportunityId, tenantId, fromStage, toStage, changedBy, timestamp } = {}) {
    this.name = 'OpportunityStageChanged';
    this.opportunityId = opportunityId;
    this.tenantId = tenantId;
    this.fromStage = fromStage;
    this.toStage = toStage;
    this.changedBy = changedBy;
    this.timestamp = timestamp || new Date();
  }
}

module.exports = OpportunityStageChanged;
