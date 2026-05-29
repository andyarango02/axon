'use strict';

function authMiddleware(jwtService) {
  return (req, res, next) => {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  };
}

module.exports = authMiddleware;
