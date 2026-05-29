'use strict';

// Requires: npm install jsonwebtoken
const config = require('../../shared/config');

class JwtService {
  sign(payload, options = {}) {
    throw new Error('Not implemented');
  }

  verify(token) {
    throw new Error('Not implemented');
  }

  decode(token) {
    throw new Error('Not implemented');
  }
}

module.exports = JwtService;
