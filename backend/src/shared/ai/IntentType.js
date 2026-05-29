'use strict';

const IntentType = Object.freeze({
  // ── Customer-initiated intents (inbound) ─────────────────
  REQUEST_QUOTE:   'REQUEST_QUOTE',   // customer wants a new quotation
  PROVIDE_INFO:    'PROVIDE_INFO',    // customer answering a question or adding data
  APPROVE_QUOTE:   'APPROVE_QUOTE',   // customer approves a sent quotation
  REJECT_QUOTE:    'REJECT_QUOTE',    // customer rejects a sent quotation
  REQUEST_STATUS:  'REQUEST_STATUS',  // customer asks about quote or order status
  FOLLOW_UP:       'FOLLOW_UP',       // customer following up a previous interaction
  GREETING:        'GREETING',        // conversational greeting, no actionable intent
  OUT_OF_SCOPE:    'OUT_OF_SCOPE',    // unrelated to business domain
  HUMAN_HANDOFF:   'HUMAN_HANDOFF',   // customer requests a human agent

  // ── System / internal intents ────────────────────────────
  GATHER_REQUIREMENTS: 'GATHER_REQUIREMENTS', // AI produced next clarifying question
  GENERATE_QUOTE:      'GENERATE_QUOTE',      // AI produced structured requirements for backend quoting
});

module.exports = IntentType;
