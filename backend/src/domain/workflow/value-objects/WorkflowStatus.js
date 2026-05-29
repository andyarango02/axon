'use strict';

const WorkflowStatus = Object.freeze({
  PENDING:     'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED:   'COMPLETED',
  FAILED:      'FAILED',
  CANCELLED:   'CANCELLED',
});

module.exports = WorkflowStatus;
