'use strict';

const PricingStrategy = Object.freeze({
  FIXED:      'FIXED',       // replaces basePrice with a fixed unit price (rule.value)
  PERCENTAGE: 'PERCENTAGE',  // applies rule.value % discount over basePrice
  TIERED:     'TIERED',      // price per quantity bracket (conditions.tiers[])
  VOLUME:     'VOLUME',      // growing % discount per unit up to a max (conditions.discountPerUnit, conditions.maxDiscount)
  NEGOTIABLE: 'NEGOTIABLE',  // marks the price as open to negotiation; no automatic adjustment
});

module.exports = PricingStrategy;
