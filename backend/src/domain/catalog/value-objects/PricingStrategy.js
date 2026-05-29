'use strict';

const PricingStrategy = Object.freeze({
  FIXED:      'FIXED',
  TIERED:     'TIERED',
  NEGOTIABLE: 'NEGOTIABLE',
  PERCENTAGE: 'PERCENTAGE',
});

module.exports = PricingStrategy;
