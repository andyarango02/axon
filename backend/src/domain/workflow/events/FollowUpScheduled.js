'use strict';

class FollowUpScheduled {
  constructor({ tenantId, resourceType, resourceId, scheduledFor, assignedTo, message, timestamp } = {}) {
    this.name = 'FollowUpScheduled';
    this.tenantId = tenantId;
    this.resourceType = resourceType;
    this.resourceId = resourceId;
    this.scheduledFor = scheduledFor;
    this.assignedTo = assignedTo || null;
    this.message = message || null;
    this.timestamp = timestamp || new Date();
  }
}

module.exports = FollowUpScheduled;
