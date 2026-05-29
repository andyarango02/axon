'use strict';

const PricingStrategy = require('../value-objects/PricingStrategy');

class PriceCalculator {
  /**
   * Selects the highest-priority applicable rule and computes the price.
   *
   * @param {import('../entities/Product')} product
   * @param {import('../entities/PricingRule')[]} rules  — all candidate rules for this tenant
   * @param {{ quantity: number, at?: Date }} options
   * @returns {{
   *   unitPrice:   number|null,
   *   discount:    number,       — percentage (0–100)
   *   total:       number|null,
   *   currency:    string,
   *   ruleApplied: string|null,  — PricingRule.id that was used, or null
   *   negotiable:  boolean
   * }}
   */
  calculate(product, rules, { quantity, at = new Date() } = {}) {
    if (!quantity || quantity <= 0) throw new Error('quantity must be a positive number');

    const applicable = rules
      .filter(r => r.isActiveAt(at) && r.isApplicableTo(product) && this._conditionsMet(r, quantity))
      .sort((a, b) => b.priority - a.priority);

    return applicable.length === 0
      ? this._noRule(product, quantity)
      : this._apply(product, applicable[0], quantity);
  }

  // ─── private ──────────────────────────────────────────────

  _conditionsMet(rule, quantity) {
    const c = rule.conditions || {};
    if (c.minQty !== undefined && quantity < c.minQty) return false;
    if (c.maxQty != null       && quantity > c.maxQty) return false;
    if (rule.strategy === PricingStrategy.TIERED) {
      return !!this._findTier(c.tiers || [], quantity);
    }
    return true;
  }

  _apply(product, rule, quantity) {
    const currency = rule.currency || product.currency || 'USD';
    const base     = product.basePrice;

    switch (rule.strategy) {

      case PricingStrategy.FIXED: {
        const unitPrice = +rule.value;
        return { unitPrice, discount: 0, total: +(unitPrice * quantity).toFixed(2), currency, ruleApplied: rule.id, negotiable: false };
      }

      case PricingStrategy.PERCENTAGE: {
        this._requireBase(base, product.name, rule.strategy);
        const discountPct = +rule.value;
        const unitPrice   = +(base * (1 - discountPct / 100)).toFixed(4);
        return { unitPrice, discount: discountPct, total: +(unitPrice * quantity).toFixed(2), currency, ruleApplied: rule.id, negotiable: false };
      }

      case PricingStrategy.TIERED: {
        const tier      = this._findTier(rule.conditions.tiers || [], quantity);
        const unitPrice = +tier.unitPrice;
        const discount  = base != null ? +((1 - unitPrice / base) * 100).toFixed(2) : 0;
        return { unitPrice, discount, total: +(unitPrice * quantity).toFixed(2), currency, ruleApplied: rule.id, negotiable: false };
      }

      case PricingStrategy.VOLUME: {
        this._requireBase(base, product.name, rule.strategy);
        const c           = rule.conditions || {};
        const rawPct      = quantity * (c.discountPerUnit || 0);
        const discountPct = +Math.min(rawPct, c.maxDiscount != null ? c.maxDiscount : 100).toFixed(2);
        const unitPrice   = +(base * (1 - discountPct / 100)).toFixed(4);
        return { unitPrice, discount: discountPct, total: +(unitPrice * quantity).toFixed(2), currency, ruleApplied: rule.id, negotiable: false };
      }

      case PricingStrategy.NEGOTIABLE: {
        const total = base != null ? +(base * quantity).toFixed(2) : null;
        return { unitPrice: base, discount: 0, total, currency, ruleApplied: rule.id, negotiable: true };
      }

      default:
        return this._noRule(product, quantity);
    }
  }

  _noRule(product, quantity) {
    const base = product.basePrice;
    return {
      unitPrice:   base,
      discount:    0,
      total:       base != null ? +(base * quantity).toFixed(2) : null,
      currency:    product.currency || 'USD',
      ruleApplied: null,
      negotiable:  false,
    };
  }

  _requireBase(base, name, strategy) {
    if (base == null) throw new Error(`Cannot apply ${strategy} rule to "${name}": basePrice is null`);
  }

  _findTier(tiers, quantity) {
    return tiers.find(t => quantity >= t.minQty && (t.maxQty == null || quantity <= t.maxQty)) || null;
  }
}

module.exports = PriceCalculator;
