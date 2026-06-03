'use strict';

const ALLOWED_TONES = ['friendly', 'professional', 'casual'];

class UpdateBotConfig {
  constructor({ tenantRepository }) {
    this.tenantRepository = tenantRepository;
  }

  async execute({ tenantId, botConfig }) {
    const { name, businessName, businessDescription, tone, additionalContext, greetingMessage } = botConfig;

    if (tone && !ALLOWED_TONES.includes(tone)) {
      throw new Error(`Invalid tone. Allowed values: ${ALLOWED_TONES.join(', ')}`);
    }

    const sanitized = {
      name:                (name                || '').trim(),
      businessName:        (businessName        || '').trim(),
      businessDescription: (businessDescription || '').trim(),
      tone:                tone || 'friendly',
      additionalContext:   (additionalContext   || '').trim(),
      greetingMessage:     (greetingMessage     || '').trim(),
    };

    return this.tenantRepository.updateBotConfig(tenantId, sanitized);
  }
}

module.exports = UpdateBotConfig;
