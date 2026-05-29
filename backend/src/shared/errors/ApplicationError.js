'use strict';

class ApplicationError extends Error {
  constructor(message, code, statusCode = 400) {
    super(message);
    this.name = 'ApplicationError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

module.exports = ApplicationError;
