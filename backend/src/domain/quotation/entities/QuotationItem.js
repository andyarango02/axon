'use strict';

class QuotationItem {
  constructor({
    id,
    tenantId,
    quotationId,
    productId,
    description,
    quantity,
    unitPrice,
    discount,
    total,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
  } = {}) {
    this.id = id;
    this.tenantId = tenantId;
    this.quotationId = quotationId;
    this.productId = productId || null;
    this.description = description;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.discount = discount || 0;
    this.total = total;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
  }
}

module.exports = QuotationItem;
