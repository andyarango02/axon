'use strict';

class FindOrCreateCustomer {
  constructor({ customerRepository, eventBus }) {
    this.customerRepository = customerRepository;
    this.eventBus = eventBus;
  }

  /**
   * @param {{ tenantId: string, phone: string, source?: string, createdBy?: string }} input
   * @returns {Promise<{ customer: import('../../../domain/customer/entities/Customer'), isNew: boolean }>}
   */
  async execute({ tenantId, phone, source = 'WHATSAPP', createdBy = null }) {
    const existing = await this.customerRepository.findByPhone(tenantId, phone);
    if (existing) return { customer: existing, isNew: false };

    const Customer = require('../../../domain/customer/entities/Customer');
    const CustomerIdentified = require('../../../domain/customer/events/CustomerIdentified');

    const newCustomer = new Customer({ tenantId, phone, source, metadata: {}, createdBy, updatedBy: createdBy });
    const saved = await this.customerRepository.save(newCustomer);

    await this.eventBus.publish('CustomerIdentified', new CustomerIdentified({
      customerId: saved.id,
      tenantId,
      phone,
    }));

    return { customer: saved, isNew: true };
  }
}

module.exports = FindOrCreateCustomer;
