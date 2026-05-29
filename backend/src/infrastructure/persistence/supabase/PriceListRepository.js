'use strict';

const IPriceListRepository = require('../../../domain/catalog/repositories/IPriceListRepository');
const PriceList = require('../../../domain/catalog/entities/PriceList');

function toRow(list) {
  const row = {
    tenant_id:   list.tenantId,
    name:        list.name,
    description: list.description || null,
    currency:    list.currency    || 'USD',
    valid_from:  list.validFrom   || null,
    valid_until: list.validUntil  || null,
    active:      list.active !== undefined ? list.active : true,
    updated_at:  new Date().toISOString(),
    created_by:  list.createdBy   || null,
    updated_by:  list.updatedBy   || null,
    deleted_at:  list.deletedAt   || null,
  };
  if (list.id) row.id = list.id;
  return row;
}

function fromRow(row) {
  return new PriceList({
    id:          row.id,
    tenantId:    row.tenant_id,
    name:        row.name,
    description: row.description,
    currency:    row.currency,
    validFrom:   row.valid_from,
    validUntil:  row.valid_until,
    active:      row.active,
    createdAt:   row.created_at,
    updatedAt:   row.updated_at,
    createdBy:   row.created_by,
    updatedBy:   row.updated_by,
    deletedAt:   row.deleted_at,
  });
}

class PriceListRepository extends IPriceListRepository {
  constructor(supabaseClient) {
    super();
    this.client = supabaseClient;
    this.table  = 'price_lists';
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
      .order('name', { ascending: true });
    if (error) throw error;
    return (data || []).map(fromRow);
  }

  async findActive(tenantId, at = new Date()) {
    const iso = at instanceof Date ? at.toISOString() : at;
    const { data, error } = await this.client
      .from(this.table).select('*')
      .eq('tenant_id', tenantId).eq('active', true)
      .is('deleted_at', null)
      .or(`valid_from.is.null,valid_from.lte.${iso}`)
      .or(`valid_until.is.null,valid_until.gte.${iso}`)
      .order('name', { ascending: true });
    if (error) throw error;
    return (data || []).map(fromRow);
  }

  async save(list) {
    const row = toRow(list);
    if (!list.id) {
      const { data, error } = await this.client.from(this.table).insert(row).select().single();
      if (error) throw error;
      return fromRow(data);
    }
    const { data, error } = await this.client
      .from(this.table).update(row)
      .eq('id', list.id).eq('tenant_id', list.tenantId)
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

module.exports = PriceListRepository;
