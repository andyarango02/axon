'use strict';

/**
 * @param {object[]} messages - Conversation history { role, content }[]
 * @param {string[]} missingFields - Fields still required to build the quote
 * @returns {string} Prompt that asks the customer the next clarifying question
 */
function gatherRequirementsPrompt(messages, missingFields) {
  throw new Error('Not implemented');
}

module.exports = { gatherRequirementsPrompt };
