'use strict';

class AuthController {
  constructor({ jwtService, userRepository }) {
    this.jwtService = jwtService;
    this.userRepository = userRepository;
  }

  async login(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
