'use strict';

const IConversationRepository = require('../../../domain/conversation/repositories/IConversationRepository');
const Conversation = require('../../../domain/conversation/entities/Conversation');
const ConversationStatus = require('../../../domain/conversation/value-objects/ConversationStatus');

const ACTIVE_STATUSES = [
  ConversationStatus.GATHERING_INFO,
  ConversationStatus.READY,
  ConversationStatus.WAITING_APPROVAL,
];

function toRow(conversation) {
  const row = {
    tenant_id:   conversation.tenantId,
    customer_id: conversation.customerId,
    channel:     conversation.channel,
    status:      conversation.status,
    context:     conversation.context  || {},
    updated_at:  new Date().toISOString(),
    created_by:  conversation.createdBy || null,
    updated_by:  conversation.updatedBy || null,
    deleted_at:  conversation.deletedAt || null,
  };
  if (conversation.id) row.id = conversation.id;
  return row;
}

function fromRow(row) {
  return new Conversation({
    id:         row.id,
    tenantId:   row.tenant_id,
    customerId: row.customer_id,
    channel:    row.channel,
    status:     row.status,
    context:    row.context,
    createdAt:  row.created_at,
    updatedAt:  row.updated_at,
    createdBy:  row.created_by,
    updatedBy:  row.updated_by,
    deletedAt:  row.deleted_at,
  });
}

class ConversationRepository extends IConversationRepository {
  constructor(supabaseClient) {
    super();
    this.client = supabaseClient;
    this.table = 'conversations';
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

  async findAll(tenantId, filters = {}) {
    let q = this.client
      .from(this.table)
      .select('*')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });

    if (filters.status)     q = q.eq('status',      filters.status);
    if (filters.customerId) q = q.eq('customer_id', filters.customerId);

    const { data, error } = await q;
    if (error) throw error;
    return (data || []).map(fromRow);
  }

  async findActiveByCustomer(tenantId, customerId) {
    const { data, error } = await this.client
      .from(this.table)
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('customer_id', customerId)
      .in('status', ACTIVE_STATUSES)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data ? fromRow(data) : null;
  }

  async save(conversation) {
    const row = toRow(conversation);

    if (!conversation.id) {
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
      .eq('id', conversation.id)
      .eq('tenant_id', conversation.tenantId)
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

module.exports = ConversationRepository;
