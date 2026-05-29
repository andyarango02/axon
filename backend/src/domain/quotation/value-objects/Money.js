'use strict';

class Money {
  constructor(amount, currency = 'USD') {
    this.amount = amount;
    this.currency = currency;
  }

  toString() {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }
}

module.exports = Money;
