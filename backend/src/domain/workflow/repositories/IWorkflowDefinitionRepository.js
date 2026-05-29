'use strict';

class IWorkflowDefinitionRepository {
  async findById(tenantId, id) { throw new Error('Not implemented'); }
  async findByTrigger(tenantId, triggerEvent) { throw new Error('Not implemented'); }
  async findAll(tenantId) { throw new Error('Not implemented'); }
  async save(workflowDefinition) { throw new Error('Not implemented'); }
  async softDelete(tenantId, id, deletedBy) { throw new Error('Not implemented'); }
}

module.exports = IWorkflowDefinitionRepository;
