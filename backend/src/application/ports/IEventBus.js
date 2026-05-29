'use strict';

class IEventBus {
  /**
   * @param {string} eventName
   * @param {object} event
   * @returns {Promise<void>}
   */
  async publish(eventName, event) { throw new Error('Not implemented'); }

  /**
   * @param {string} eventName
   * @param {function} handler
   * @returns {void}
   */
  subscribe(eventName, handler) { throw new Error('Not implemented'); }
}

module.exports = IEventBus;
