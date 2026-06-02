'use strict';

const Quotation        = require('../../../domain/quotation/entities/Quotation');
const QuotationItem    = require('../../../domain/quotation/entities/QuotationItem');
const QuotationStatus  = require('../../../domain/quotation/value-objects/QuotationStatus');
const QuotationDrafted = require('../../../domain/quotation/events/QuotationDrafted');
const NotFoundError    = require('../../../shared/errors/NotFoundError');
const ApplicationError = require('../../../shared/errors/ApplicationError');

class GenerateQuotationDraft {
  constructor({ quotationRepository, productRepository, pricingRuleRepository, priceCalculator, eventBus }) {
    this.quotationRepository   = quotationRepository;
    this.productRepository     = productRepository;
    this.pricingRuleRepository = pricingRuleRepository;
    this.priceCalculator       = priceCalculator;
    this.eventBus              = eventBus;
  }

  /**
   * @param {{
   *   tenantId: string,
   *   customerId: string,
   *   conversationId?: string,
   *   requestedItems: Array<{ productId: string, quantity: number }>,
   *   taxRate?: number,
   *   currency?: string,
   *   validUntil?: string,
   *   notes?: string,
   *   createdBy?: string
   * }} input
   * @returns {Promise<import('../../../domain/quotation/entities/Quotation')>}
   */
  async execute({ tenantId, customerId, conversationId, requestedItems,
                  taxRate = 0, currency, validUntil, notes, createdBy }) {
    if (!requestedItems || requestedItems.length === 0) {
      throw new ApplicationError('requestedItems must not be empty', 'INVALID_INPUT', 400);
    }

    // Load active pricing rules once — reused for every item
    const activeRules = await this.pricingRuleRepository.findActiveRules(tenantId);

    let resolvedCurrency = currency || null;
    const items = [];

    for (const reqItem of requestedItems) {
      if (!reqItem.productId) {
        throw new ApplicationError(
          'productId is required for every item in this version',
          'PRODUCT_ID_REQUIRED',
          400
        );
      }

      const qty = +reqItem.quantity;
      if (!qty || qty <= 0) {
        throw new ApplicationError('quantity must be a positive number', 'INVALID_QUANTITY', 400);
      }

      const product = await this.productRepository.findById(tenantId, reqItem.productId);
      if (!product) throw new NotFoundError('Product', reqItem.productId);

      const priceResult = this.priceCalculator.calculate(product, activeRules, { quantity: qty });

      if (priceResult.unitPrice === null) {
        throw new ApplicationError(
          `Product "${product.name}" has no resolvable price. ` +
          `Assign a FIXED pricing rule before generating a quotation.`,
          'UNRESOLVABLE_PRICE',
          422
        );
      }

      if (!resolvedCurrency) resolvedCurrency = priceResult.currency;

      items.push(new QuotationItem({
        tenantId,
        productId:   product.id,
        description: product.name,
        quantity:    qty,
        unitPrice:   priceResult.unitPrice,
        discount:    priceResult.discount,
        total:       priceResult.total,
        createdBy:   createdBy || null,
        updatedBy:   createdBy || null,
      }));
    }

    const subtotal = +items.reduce((sum, i) => sum + i.total, 0).toFixed(2);
    const tax      = +(subtotal * (+taxRate / 100)).toFixed(2);
    const total    = +(subtotal + tax).toFixed(2);

    const quotation = new Quotation({
      tenantId,
      customerId,
      conversationId: conversationId || null,
      status:         QuotationStatus.PENDING_APPROVAL,
      items,
      subtotal,
      tax,
      total,
      currency:   resolvedCurrency || 'USD',
      validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes:      notes || null,
      createdBy:  createdBy || null,
      updatedBy:  createdBy || null,
    });

    const saved = await this.quotationRepository.save(quotation);

    await this.eventBus.publish('QuotationDrafted', new QuotationDrafted({
      quotationId:    saved.id,
      tenantId,
      customerId,
      conversationId: conversationId || null,
    }));

    return saved;
  }
}

module.exports = GenerateQuotationDraft;
