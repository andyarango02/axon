'use strict';

const ICustomerRepository = require('../../../domain/customer/repositories/ICustomerRepository');
const Customer = require('../../../domain/customer/entities/Customer');

function toRow(customer) {
  const row = {
    tenant_id:  customer.tenantId,
    phone:      customer.phone,
    name:       customer.name       || null,
    email:      customer.email      || null,
    company:    customer.company    || null,
    source:     customer.source,
    metadata:   customer.metadata   || {},
    updated_at: new Date().toISOString(),
    created_by: customer.createdBy  || null,
    updated_by: customer.updatedBy  || null,
    deleted_at: customer.deletedAt  || null,
  };
  if (customer.id) row.id = customer.id;
  return row;
}

function fromRow(row) {
  return new Customer({
    id:        row.id,
    tenantId:  row.tenant_id,
    phone:     row.phone,
    name:      row.name,
    email:     row.email,
    company:   row.company,
    source:    row.source,
    metadata:  row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    deletedAt: row.deleted_at,
  });
}

class CustomerRepository extends ICustomerRepository {
  constructor(supabaseClient) {
    super();
    this.client = supabaseClient;
    this.table = 'customers';
  }

  async findById(tenantId, id) {
    const { data, error } = await this.client
      .from(this.table)
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('id', id)
      .is('deleted_at', null)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return fromRow(data);
  }

  async findByPhone(tenantId, phone) {
    const { data, error } = await this.client
      .from(this.table)
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('phone', phone)
      .is('deleted_at', null)
      .maybeSingle();
    if (error) throw error;
    return data ? fromRow(data) : null;
  }

  async findAll(tenantId, filters = {}) {
    let query = this.client
      .from(this.table)
      .select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (filters.name)  query = query.ilike('name', `%${filters.name}%`);
    if (filters.phone) query = query.eq('phone', filters.phone);

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(fromRow);
  }

  async save(customer) {
    const row = toRow(customer);

    if (!customer.id) {
      const { data, error } = await this.client
        .from(this.table)
        .insert(row)
        .select()
        .single();
      if (error) throw error;
      return fromRow(data);
    }

    const { data, error } = await this.client
      .from(this.table)
      .update(row)
      .eq('id', customer.id)
      .eq('tenant_id', customer.tenantId)
      .select()
      .single();
    if (error) throw error;
    return fromRow(data);
  }

  async softDelete(tenantId, id, deletedBy) {
    const { error } = await this.client
      .from(this.table)
      .update({ deleted_at: new Date().toISOString(), updated_by: deletedBy || null })
      .eq('id', id)
      .eq('tenant_id', tenantId);
    if (error) throw error;
  }
}

module.exports = CustomerRepository;
