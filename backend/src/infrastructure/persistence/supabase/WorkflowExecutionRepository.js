'use strict';

const IWorkflowExecutionRepository = require('../../../domain/workflow/repositories/IWorkflowExecutionRepository');

class WorkflowExecutionRepository extends IWorkflowExecutionRepository {
  constructor(supabaseClient) {
    super();
    this.client = supabaseClient;
    this.table = 'workflow_executions';
  }

  async findById(tenantId, id) {
    throw new Error('Not implemented');
  }

  async findByResource(tenantId, resourceType, resourceId) {
    throw new Error('Not implemented');
  }

  async findPendingApprovals(tenantId, assignedTo) {
    throw new Error('Not implemented');
  }

  async save(workflowExecution) {
    throw new Error('Not implemented');
  }
}

module.exports = WorkflowExecutionRepository;
