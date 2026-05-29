'use strict';

const IProductRepository = require('../../../domain/catalog/repositories/IProductRepository');
const Product = require('../../../domain/catalog/entities/Product');

function toRow(product) {
  const row = {
    tenant_id:   product.tenantId,
    sku:         product.sku         || null,
    name:        product.name,
    description: product.description || null,
    type:        product.type        || 'PHYSICAL',
    base_price:  product.basePrice   ?? null,
    currency:    product.currency    || 'USD',
    unit:        product.unit        || null,
    status:      product.status      || 'ACTIVE',
    category:    product.category    || null,
    metadata:    product.metadata    || {},
    updated_at:  new Date().toISOString(),
    created_by:  product.createdBy   || null,
    updated_by:  product.updatedBy   || null,
    deleted_at:  product.deletedAt   || null,
  };
  if (product.id) row.id = product.id;
  return row;
}

function fromRow(row) {
  return new Product({
    id:          row.id,
    tenantId:    row.tenant_id,
    sku:         row.sku,
    name:        row.name,
    description: row.description,
    type:        row.type,
    basePrice:   row.base_price != null ? +row.base_price : null,
    currency:    row.currency,
    unit:        row.unit,
    status:      row.status,
    category:    row.category,
    metadata:    row.metadata,
    createdAt:   row.created_at,
    updatedAt:   row.updated_at,
    createdBy:   row.created_by,
    updatedBy:   row.updated_by,
    deletedAt:   row.deleted_at,
  });
}

class ProductRepository extends IProductRepository {
  constructor(supabaseClient) {
    super();
    this.client = supabaseClient;
    this.table  = 'products';
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

  async findBySku(tenantId, sku) {
    const { data, error } = await this.client
      .from(this.table).select('*')
      .eq('tenant_id', tenantId).eq('sku', sku)
      .is('deleted_at', null).maybeSingle();
    if (error) throw error;
    return data ? fromRow(data) : null;
  }

  async search(tenantId, query = '', filters = {}) {
    let q = this.client
      .from(this.table).select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (query) q = q.or(`name.ilike.%${query}%,sku.ilike.%${query}%,description.ilike.%${query}%`);
    if (filters.status)   q = q.eq('status',   filters.status);
    if (filters.category) q = q.eq('category', filters.category);
    if (filters.type)     q = q.eq('type',     filters.type);

    const { data, error } = await q;
    if (error) throw error;
    return (data || []).map(fromRow);
  }

  async findAll(tenantId, filters = {}) {
    return this.search(tenantId, '', filters);
  }

  async save(product) {
    const row = toRow(product);
    if (!product.id) {
      const { data, error } = await this.client.from(this.table).insert(row).select().single();
      if (error) throw error;
      return fromRow(data);
    }
    const { data, error } = await this.client
      .from(this.table).update(row)
      .eq('id', product.id).eq('tenant_id', product.tenantId)
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

module.exports = ProductRepository;
