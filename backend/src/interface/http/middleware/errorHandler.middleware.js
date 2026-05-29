'use strict';

const ApplicationError = require('../../../shared/errors/ApplicationError');
const DomainError = require('../../../shared/errors/DomainError');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({ error: err.message, code: err.code });
  }
  if (err instanceof DomainError) {
    return res.status(400).json({ error: err.message, code: err.code });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}

module.exports = errorHandler;
