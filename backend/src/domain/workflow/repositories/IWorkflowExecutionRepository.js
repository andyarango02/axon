'use strict';

class IWorkflowExecutionRepository {
  async findById(tenantId, id) { throw new Error('Not implemented'); }
  async findByResource(tenantId, resourceType, resourceId) { throw new Error('Not implemented'); }
  async findPendingApprovals(tenantId, assignedTo) { throw new Error('Not implemented'); }
  async save(workflowExecution) { throw new Error('Not implemented'); }
}

module.exports = IWorkflowExecutionRepository;
