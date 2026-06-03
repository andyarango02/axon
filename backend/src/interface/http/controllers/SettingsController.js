'use strict';

class SettingsController {
  constructor({ getBotConfig, updateBotConfig }) {
    this.getBotConfig    = getBotConfig;
    this.updateBotConfig = updateBotConfig;
  }

  async getBotSettings(req, res, next) {
    try {
      const config = await this.getBotConfig.execute({ tenantId: req.tenantId });
      res.json({ data: config });
    } catch (err) {
      next(err);
    }
  }

  async updateBotSettings(req, res, next) {
    try {
      const updated = await this.updateBotConfig.execute({
        tenantId:  req.tenantId,
        botConfig: req.body,
      });
      res.json({ data: updated });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = SettingsController;
