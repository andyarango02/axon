'use strict';

class QuotationController {
  constructor({ listQuotations, approveQuotation, rejectQuotation, sendQuotation }) {
    this.listQuotations = listQuotations;
    this.approveQuotation = approveQuotation;
    this.rejectQuotation = rejectQuotation;
    this.sendQuotation = sendQuotation;
  }

  async list(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }

  async approve(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }

  async reject(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }

  async send(req, res, next) {
    try {
      throw new Error('Not implemented');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = QuotationController;
