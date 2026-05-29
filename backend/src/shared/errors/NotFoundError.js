'use strict';

const ApplicationError = require('./ApplicationError');

class NotFoundError extends ApplicationError {
  constructor(resource, id) {
    super(`${resource} not found: ${id}`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
