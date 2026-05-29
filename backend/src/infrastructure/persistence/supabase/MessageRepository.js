'use strict';

const IMessageRepository = require('../../../domain/conversation/repositories/IMessageRepository');
const Message = require('../../../domain/conversation/entities/Message');

function toRow(message) {
  const row = {
    tenant_id:       message.tenantId,
    conversation_id: message.conversationId,
    direction:       message.direction,
    body:            message.body,
    media_url:       message.mediaUrl   || null,
    external_id:     message.externalId || null,
    updated_at:      new Date().toISOString(),
    created_by:      message.createdBy  || null,
    updated_by:      message.updatedBy  || null,
  };
  if (message.id) row.id = message.id;
  return row;
}

function fromRow(row) {
  return new Message({
    id:             row.id,
    tenantId:       row.tenant_id,
    conversationId: row.conversation_id,
    direction:      row.direction,
    body:           row.body,
    mediaUrl:       row.media_url,
    externalId:     row.external_id,
    createdAt:      row.created_at,
    updatedAt:      row.updated_at,
    createdBy:      row.created_by,
    updatedBy:      row.updated_by,
  });
}

class MessageRepository extends IMessageRepository {
  constructor(supabaseClient) {
    super();
    this.client = supabaseClient;
    this.table = 'messages';
  }

  async save(message) {
    const row = toRow(message);

    if (!message.id) {
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
      .eq('id', message.id)
      .eq('tenant_id', message.tenantId)
      .select()
      .single();
    if (error) throw error;
    return fromRow(data);
  }

  async findByConversation(tenantId, conversationId, limit = 50, offset = 0) {
    const { data, error } = await this.client
      .from(this.table)
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return (data || []).map(fromRow);
  }
}

module.exports = MessageRepository;
