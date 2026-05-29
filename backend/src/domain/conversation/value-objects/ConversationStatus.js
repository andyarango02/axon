'use strict';

const ConversationStatus = Object.freeze({
  GATHERING_INFO:   'GATHERING_INFO',
  READY:            'READY',
  WAITING_APPROVAL: 'WAITING_APPROVAL',
  CLOSED:           'CLOSED',
});

module.exports = ConversationStatus;
