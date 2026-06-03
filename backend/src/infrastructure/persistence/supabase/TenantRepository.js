'use strict';

const ITenantRepository = require('../../../domain/tenant/repositories/ITenantRepository');

const DEFAULT_BOT_CONFIG = {
  name:                'Asistente',
  businessName:        '',
  businessDescription: '',
  tone:                'friendly',
  additionalContext:   '',
  greetingMessage:     '',
};

class TenantRepository extends ITenantRepository {
  constructor(supabaseClient) {
    super();
    this.client = supabaseClient;
    this.table = 'tenants';
  }

  async findById(id) {
    throw new Error('Not implemented');
  }

  async findBySlug(slug) {
    throw new Error('Not implemented');
  }

  async save(tenant) {
    throw new Error('Not implemented');
  }

  async softDelete(id, deletedBy) {
    throw new Error('Not implemented');
  }

  async getBotConfig(tenantId) {
    const { data, error } = await this.client
      .from('tenants')
      .select('settings')
      .eq('id', tenantId)
      .single();

    if (error || !data) return { ...DEFAULT_BOT_CONFIG };
    return { ...DEFAULT_BOT_CONFIG, ...(data.settings?.bot || {}) };
  }

  async updateBotConfig(tenantId, botConfig) {
    const { data: current, error: fetchErr } = await this.client
      .from('tenants')
      .select('settings')
      .eq('id', tenantId)
      .single();

    if (fetchErr) throw new Error(`TenantRepository: failed to fetch tenant — ${fetchErr.message}`);

    const settings = { ...(current?.settings || {}), bot: botConfig };

    const { error: updateErr } = await this.client
      .from('tenants')
      .update({ settings, updated_at: new Date().toISOString() })
      .eq('id', tenantId);

    if (updateErr) throw new Error(`TenantRepository: failed to update bot config — ${updateErr.message}`);

    return botConfig;
  }
}

module.exports = TenantRepository;
