'use strict';

const IAIService = require('../../../application/ports/IAIService');
const AIResponse = require('../../../shared/ai/AIResponse');
const AIError    = require('../../../shared/errors/AIError');
const { extractIntentPrompt }      = require('./prompts/extractIntent');
const { gatherRequirementsPrompt } = require('./prompts/gatherRequirements');
const { generateQuotePrompt }      = require('./prompts/generateQuote');

const REQUIRED_FIELDS = ['intent', 'confidence', 'missingFields', 'extractedData'];

function parseAIResponse(raw, methodName) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new AIError(`${methodName}: model returned invalid JSON`, err);
  }
  for (const field of REQUIRED_FIELDS) {
    if (!(field in parsed)) {
      throw new AIError(`${methodName}: missing field '${field}' in model response`);
    }
  }
  return new AIResponse(parsed);
}

class OpenAIService extends IAIService {
  constructor(openaiClient, config = {}) {
    super();
    this.client = openaiClient;
    this.model  = config.model || 'gpt-4o';
  }

  async _complete(messages, methodName) {
    let completion;
    try {
      completion = await this.client.chat.completions.create({
        model:           this.model,
        messages,
        response_format: { type: 'json_object' },
        temperature:     0.2,
      });
    } catch (err) {
      throw new AIError(`${methodName}: OpenAI API error — ${err.message}`, err);
    }

    const raw = completion.choices?.[0]?.message?.content;
    if (!raw) throw new AIError(`${methodName}: empty response from model`);

    return parseAIResponse(raw, methodName);
  }

  async extractIntent(messages) {
    return this._complete(extractIntentPrompt(messages), 'extractIntent');
  }

  async gatherRequirements(messages, missingFields) {
    return this._complete(gatherRequirementsPrompt(messages, missingFields), 'gatherRequirements');
  }

  /**
   * Extracts structured requirements from the conversation.
   * Does NOT return prices — price resolution is owned by the backend.
   */
  async generateQuote(messages) {
    return this._complete(generateQuotePrompt(messages), 'generateQuote');
  }
}

module.exports = OpenAIService;
