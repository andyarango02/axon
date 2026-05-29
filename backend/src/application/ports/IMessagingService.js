'use strict';

class IMessagingService {
  /**
   * @param {{ to: string, body: string, tenantId: string }} options
   * @returns {Promise<{ messageId: string }>}
   */
  async sendMessage(options) { throw new Error('Not implemented'); }

  /**
   * @param {{ to: string, templateName: string, variables: object, tenantId: string }} options
   * @returns {Promise<{ messageId: string }>}
   */
  async sendTemplate(options) { throw new Error('Not implemented'); }
}

module.exports = IMessagingService;
