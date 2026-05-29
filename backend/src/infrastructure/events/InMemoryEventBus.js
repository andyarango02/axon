'use strict';

const { EventEmitter } = require('events');
const IEventBus = require('../../application/ports/IEventBus');

class InMemoryEventBus extends IEventBus {
  constructor() {
    super();
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(50);
  }

  async publish(eventName, event) {
    this.emitter.emit(eventName, event);
  }

  subscribe(eventName, handler) {
    this.emitter.on(eventName, handler);
  }
}

module.exports = InMemoryEventBus;
