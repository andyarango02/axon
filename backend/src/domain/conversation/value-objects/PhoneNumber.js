'use strict';

class PhoneNumber {
  constructor(raw) {
    this.value = raw;
  }

  toString() {
    return this.value;
  }
}

module.exports = PhoneNumber;
