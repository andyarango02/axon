'use strict';

class GetBotConfig {
  constructor({ tenantRepository }) {
    this.tenantRepository = tenantRepository;
  }

  async execute({ tenantId }) {
    return this.tenantRepository.getBotConfig(tenantId);
  }
}

module.exports = GetBotConfig;
