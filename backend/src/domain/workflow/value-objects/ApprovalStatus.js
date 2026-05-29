'use strict';

const ApprovalStatus = Object.freeze({
  PENDING:   'PENDING',
  APPROVED:  'APPROVED',
  REJECTED:  'REJECTED',
  ESCALATED: 'ESCALATED',
  EXPIRED:   'EXPIRED',
});

module.exports = ApprovalStatus;
