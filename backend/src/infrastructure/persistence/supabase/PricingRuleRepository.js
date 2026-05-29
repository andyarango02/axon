'use strict';

const IPricingRuleRepository = require('../../../domain/catalog/repositories/IPricingRuleRepository');
const PricingRule = require('../../../domain/catalog/entities/PricingRule');

function toRow(rule) {
  const row = {
    tenant_id:     rule.tenantId,
    name:          rule.name          || null,
    product_id:    rule.productId     || null,
    price_list_id: rule.priceListId   || null,
    category:      rule.category      || null,
    strategy:      rule.strategy,
    conditions:    rule.conditions    || {},
    value:         rule.value,
    currency:      rule.currency      || null,
    valid_from:    rule.validFrom     || null,
    valid_until:   rule.validUntil    || null,
    priority:      rule.priority      ?? 0,
    active:        rule.active !== undefined ? rule.active : true,
    updated_at:    new Date().toISOString(),
    created_by:    rule.createdBy     || null,
    updated_by:    rule.updatedBy     || null,
    deleted_at:    rule.deletedAt     || null,
  };
  if (rule.id) row.id = rule.id;
  return row;
}

function fromRow(row) {
  return new PricingRule({
    id:          row.id,
    tenantId:    row.tenant_id,
    name:        row.name,
    productId:   row.product_id,
    priceListId: row.price_list_id,
    category:    row.category,
    strategy:    row.strategy,
    conditions:  row.conditions,
    value:       row.value != null ? +row.value : null,
    currency:    row.currency,
    validFrom:   row.valid_from,
    validUntil:  row.valid_until,
    priority:    row.priority,
    active:      row.active,
    createdAt:   row.created_at,
    updatedAt:   row.updated_at,
    createdBy:   row.created_by,
    updatedBy:   row.updated_by,
    deletedAt:   row.deleted_at,
  });
}

class PricingRuleRepository extends IPricingRuleRepository {
  constructor(supabaseClient) {
    super();
    this.client = supabaseClient;
    this.table  = 'pricing_rules';
  }

  async findById(tenantId, id) {
    const { data, error } = await this.client
      .from(this.table).select('*')
      .eq('tenant_id', tenantId).eq('id', id)
      .is('deleted_at', null).single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return fromRow(data);
  }

  async findAll(tenantId) {
    const { data, error } = await this.client
      .from(this.table).select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('priority', { ascending: false });
    if (error) throw error;
    return (data || []).map(fromRow);
  }

  async findByProduct(tenantId, productId) {
    const { data, error } = await this.client
      .from(this.table).select('*')
      .eq('tenant_id', tenantId).eq('product_id', productId)
      .is('deleted_at', null)
      .order('priority', { ascending: false });
    if (error) throw error;
    return (data || []).map(fromRow);
  }

  async findActiveRules(tenantId, at = new Date()) {
    const iso = at instanceof Date ? at.toISOString() : at;
    const { data, error } = await this.client
      .from(this.table).select('*')
      .eq('tenant_id', tenantId).eq('active', true)
      .is('deleted_at', null)
      .or(`valid_from.is.null,valid_from.lte.${iso}`)
      .or(`valid_until.is.null,valid_until.gte.${iso}`)
      .order('priority', { ascending: false });
    if (error) throw error;
    return (data || []).map(fromRow);
  }

  async findActiveByCategory(tenantId, category, at = new Date()) {
    const iso = at instanceof Date ? at.toISOString() : at;
    const { data, error } = await this.client
      .from(this.table).select('*')
      .eq('tenant_id', tenantId).eq('active', true).eq('category', category)
      .is('deleted_at', null)
      .or(`valid_from.is.null,valid_from.lte.${iso}`)
      .or(`valid_until.is.null,valid_until.gte.${iso}`)
      .order('priority', { ascending: false });
    if (error) throw error;
    return (data || []).map(fromRow);
  }

  async findByPriceList(tenantId, priceListId) {
    const { data, error } = await this.client
      .from(this.table).select('*')
      .eq('tenant_id', tenantId).eq('price_list_id', priceListId)
      .is('deleted_at', null)
      .order('priority', { ascending: false });
    if (error) throw error;
    return (data || []).map(fromRow);
  }

  async save(rule) {
    const row = toRow(rule);
    if (!rule.id) {
      const { data, error } = await this.client.from(this.table).insert(row).select().single();
      if (error) throw error;
      return fromRow(data);
    }
    const { data, error } = await this.client
      .from(this.table).update(row)
      .eq('id', rule.id).eq('tenant_id', rule.tenantId)
      .select().single();
    if (error) throw error;
    return fromRow(data);
  }

  async softDelete(tenantId, id, deletedBy) {
    const { error } = await this.client
      .from(this.table)
      .update({ deleted_at: new Date().toISOString(), updated_by: deletedBy || null })
      .eq('id', id).eq('tenant_id', tenantId);
    if (error) throw error;
  }
}

module.exports = PricingRuleRepository;
