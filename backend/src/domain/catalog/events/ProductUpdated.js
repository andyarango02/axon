'use strict';

class ProductUpdated {
  constructor({ productId, tenantId, updatedBy, changes, timestamp } = {}) {
    this.name = 'ProductUpdated';
    this.productId = productId;
    this.tenantId = tenantId;
    this.updatedBy = updatedBy;
    this.changes = changes || {};
    this.timestamp = timestamp || new Date();
  }
}

module.exports = ProductUpdated;
