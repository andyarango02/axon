'use strict';

// Reads tenantId from the verified JWT payload (set by authMiddleware)
// and attaches it to req.tenantId for all downstream handlers.
function tenantMiddleware(req, res, next) {
  throw new Error('Not implemented');
}

module.exports = tenantMiddleware;
