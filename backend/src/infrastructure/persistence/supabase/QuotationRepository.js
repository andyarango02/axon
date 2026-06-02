'use strict';

const IQuotationRepository = require('../../../domain/quotation/repositories/IQuotationRepository');
const Quotation     = require('../../../domain/quotation/entities/Quotation');
const QuotationItem = require('../../../domain/quotation/entities/QuotationItem');

// ── Mappers ──────────────────────────────────────────────────

function toQuotationRow(q) {
  const row = {
    tenant_id:       q.tenantId,
    conversation_id: q.conversationId || null,
    customer_id:     q.customerId,
    opportunity_id:  q.opportunityId  || null,
    status:          q.status,
    subtotal:        q.subtotal       ?? 0,
    tax:             q.tax            ?? 0,
    total:           q.total          ?? 0,
    currency:        q.currency       || 'USD',
    valid_until:     q.validUntil     || null,
    notes:           q.notes          || null,
    external_ref:    q.externalRef    || null,
    updated_at:      new Date().toISOString(),
    created_by:      q.createdBy      || null,
    updated_by:      q.updatedBy      || null,
    deleted_at:      q.deletedAt      || null,
  };
  if (q.id) row.id = q.id;
  return row;
}

function fromQuotationRow(row, items = []) {
  return new Quotation({
    id:             row.id,
    tenantId:       row.tenant_id,
    conversationId: row.conversation_id,
    customerId:     row.customer_id,
    opportunityId:  row.opportunity_id,
    status:         row.status,
    items,
    subtotal:       row.subtotal != null ? +row.subtotal : 0,
    tax:            row.tax      != null ? +row.tax      : 0,
    total:          row.total    != null ? +row.total    : 0,
    currency:       row.currency,
    validUntil:     row.valid_until,
    notes:          row.notes,
    externalRef:    row.external_ref,
    createdAt:      row.created_at,
    updatedAt:      row.updated_at,
    createdBy:      row.created_by,
    updatedBy:      row.updated_by,
    deletedAt:      row.deleted_at,
  });
}

function toItemRow(item, quotationId) {
  return {
    tenant_id:    item.tenantId,
    quotation_id: quotationId || item.quotationId,
    product_id:   item.productId  || null,
    description:  item.description,
    quantity:     item.quantity,
    unit_price:   item.unitPrice,
    discount:     item.discount   ?? 0,
    total:        item.total,
    updated_at:   new Date().toISOString(),
    created_by:   item.createdBy  || null,
    updated_by:   item.updatedBy  || null,
  };
}

function fromItemRow(row) {
  return new QuotationItem({
    id:          row.id,
    tenantId:    row.tenant_id,
    quotationId: row.quotation_id,
    productId:   row.product_id,
    description: row.description,
    quantity:    row.quantity   != null ? +row.quantity   : 0,
    unitPrice:   row.unit_price != null ? +row.unit_price : 0,
    discount:    row.discount   != null ? +row.discount   : 0,
    total:       row.total      != null ? +row.total      : 0,
    createdAt:   row.created_at,
    updatedAt:   row.updated_at,
    createdBy:   row.created_by,
    updatedBy:   row.updated_by,
  });
}

// ── Repository ───────────────────────────────────────────────

class QuotationRepository extends IQuotationRepository {
  constructor(supabaseClient) {
    super();
    this.client     = supabaseClient;
    this.table      = 'quotations';
    this.itemsTable = 'quotation_items';
  }

  async findById(tenantId, id) {
    const { data: qRow, error: qErr } = await this.client
      .from(this.table).select('*')
      .eq('tenant_id', tenantId).eq('id', id)
      .is('deleted_at', null).single();
    if (qErr) {
      if (qErr.code === 'PGRST116') return null;
      throw qErr;
    }

    const { data: iRows, error: iErr } = await this.client
      .from(this.itemsTable).select('*')
      .eq('tenant_id', tenantId).eq('quotation_id', id)
      .order('created_at', { ascending: true });
    if (iErr) throw iErr;

    return fromQuotationRow(qRow, (iRows || []).map(fromItemRow));
  }

  async findByConversation(tenantId, conversationId) {
    return this.findAll(tenantId, { conversationId });
  }

  async findByCustomer(tenantId, customerId, filters = {}) {
    return this.findAll(tenantId, { ...filters, customerId });
  }

  async findAll(tenantId, filters = {}) {
    let q = this.client
      .from(this.table).select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (filters.status)         q = q.eq('status',          filters.status);
    if (filters.customerId)     q = q.eq('customer_id',     filters.customerId);
    if (filters.conversationId) q = q.eq('conversation_id', filters.conversationId);

    const { data, error } = await q;
    if (error) throw error;
    // items are not loaded in list queries — use findById for full detail
    return (data || []).map(row => fromQuotationRow(row, []));
  }

  async save(quotation) {
    const qRow = toQuotationRow(quotation);

    if (!quotation.id) {
      const { data: qData, error: qErr } = await this.client
        .from(this.table).insert(qRow).select().single();
      if (qErr) throw qErr;

      const savedItems = await this._insertItems(quotation.items || [], qData.id);
      return fromQuotationRow(qData, savedItems);
    }

    const { data: qData, error: qErr } = await this.client
      .from(this.table).update(qRow)
      .eq('id', quotation.id).eq('tenant_id', quotation.tenantId)
      .select().single();
    if (qErr) throw qErr;

    // Replace items: delete existing then re-insert
    const { error: delErr } = await this.client
      .from(this.itemsTable)
      .delete()
      .eq('quotation_id', quotation.id)
      .eq('tenant_id', quotation.tenantId);
    if (delErr) throw delErr;

    const savedItems = await this._insertItems(quotation.items || [], quotation.id);
    return fromQuotationRow(qData, savedItems);
  }

  async softDelete(tenantId, id, deletedBy) {
    const { error } = await this.client
      .from(this.table)
      .update({ deleted_at: new Date().toISOString(), updated_by: deletedBy || null })
      .eq('id', id).eq('tenant_id', tenantId);
    if (error) throw error;
  }

  async _insertItems(items, quotationId) {
    if (!items.length) return [];
    const rows = items.map(item => toItemRow(item, quotationId));
    const { data, error } = await this.client
      .from(this.itemsTable).insert(rows).select();
    if (error) throw error;
    return (data || []).map(fromItemRow);
  }
}

module.exports = QuotationRepository;
