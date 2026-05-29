'use strict';

const IWorkflowDefinitionRepository = require('../../../domain/workflow/repositories/IWorkflowDefinitionRepository');

class WorkflowDefinitionRepository extends IWorkflowDefinitionRepository {
  constructor(supabaseClient) {
    super();
    this.client = supabaseClient;
    this.table = 'workflow_definitions';
  }

  async findById(tenantId, id) {
    throw new Error('Not implemented');
  }

  async findByTrigger(tenantId, triggerEvent) {
    throw new Error('Not implemented');
  }

  async findAll(tenantId) {
    throw new Error('Not implemented');
  }

  async save(workflowDefinition) {
    throw new Error('Not implemented');
  }

  async softDelete(tenantId, id, deletedBy) {
    throw new Error('Not implemented');
  }
}

module.exports = WorkflowDefinitionRepository;
