'use strict';

const ApplicationError = require('./ApplicationError');

class AIError extends ApplicationError {
  constructor(message, cause = null) {
    super(message, 'AI_ERROR', 502);
    this.name  = 'AIError';
    this.cause = cause;
  }
}

module.exports = AIError;
