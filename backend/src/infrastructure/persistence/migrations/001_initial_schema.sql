-- Axon — Initial Database Schema
-- All tables include audit fields: id, tenant_id, created_at, updated_at, created_by, updated_by
-- Soft-delete tables also include: deleted_at

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TENANTS
-- ============================================================
CREATE TABLE tenants (
  id          UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(100) NOT NULL UNIQUE,
  plan        VARCHAR(50)  NOT NULL DEFAULT 'free',
  settings    JSONB        NOT NULL DEFAULT '{}',
  active      BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_by  UUID,
  updated_by  UUID,
  deleted_at  TIMESTAMPTZ
);

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
  id            UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id     UUID         NOT NULL REFERENCES tenants(id),
  email         VARCHAR(255) NOT NULL,
  name          VARCHAR(255) NOT NULL,
  role          VARCHAR(50)  NOT NULL DEFAULT 'agent',
  password_hash VARCHAR(255) NOT NULL,
  active        BOOLEAN      NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_by    UUID         REFERENCES users(id),
  updated_by    UUID         REFERENCES users(id),
  deleted_at    TIMESTAMPTZ,
  UNIQUE (tenant_id, email)
);

-- ============================================================
-- CUSTOMERS
-- ============================================================
CREATE TABLE customers (
  id          UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID         NOT NULL REFERENCES tenants(id),
  phone       VARCHAR(50)  NOT NULL,
  name        VARCHAR(255),
  email       VARCHAR(255),
  company     VARCHAR(255),
  source      VARCHAR(50)  NOT NULL DEFAULT 'WHATSAPP',
  metadata    JSONB        NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_by  UUID         REFERENCES users(id),
  updated_by  UUID         REFERENCES users(id),
  deleted_at  TIMESTAMPTZ,
  UNIQUE (tenant_id, phone)
);

-- ============================================================
-- CONVERSATIONS
-- ============================================================
CREATE TABLE conversations (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID        NOT NULL REFERENCES tenants(id),
  customer_id UUID        NOT NULL REFERENCES customers(id),
  channel     VARCHAR(50) NOT NULL DEFAULT 'WHATSAPP',
  status      VARCHAR(50) NOT NULL DEFAULT 'GATHERING_INFO',
  context     JSONB       NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by  UUID        REFERENCES users(id),
  updated_by  UUID        REFERENCES users(id),
  deleted_at  TIMESTAMPTZ
);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE messages (
  id              UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       UUID         NOT NULL REFERENCES tenants(id),
  conversation_id UUID         NOT NULL REFERENCES conversations(id),
  direction       VARCHAR(10)  NOT NULL,  -- INBOUND | OUTBOUND
  body            TEXT         NOT NULL,
  media_url       TEXT,
  external_id     VARCHAR(255),
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_by      UUID         REFERENCES users(id),
  updated_by      UUID         REFERENCES users(id)
);

-- ============================================================
-- CATALOG — PRODUCTS
-- ============================================================
CREATE TABLE products (
  id          UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID           NOT NULL REFERENCES tenants(id),
  sku         VARCHAR(100),
  name        VARCHAR(255)   NOT NULL,
  description TEXT,
  base_price  NUMERIC(12, 2) NOT NULL,
  currency    VARCHAR(10)    NOT NULL DEFAULT 'USD',
  unit        VARCHAR(50),
  status      VARCHAR(50)    NOT NULL DEFAULT 'ACTIVE',
  category    VARCHAR(100),
  metadata    JSONB          NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  created_by  UUID           REFERENCES users(id),
  updated_by  UUID           REFERENCES users(id),
  deleted_at  TIMESTAMPTZ,
  UNIQUE (tenant_id, sku)
);

-- ============================================================
-- CATALOG — PRICING RULES
-- ============================================================
CREATE TABLE pricing_rules (
  id          UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID           NOT NULL REFERENCES tenants(id),
  product_id  UUID           REFERENCES products(id),  -- NULL = applies to all products
  strategy    VARCHAR(50)    NOT NULL,
  conditions  JSONB          NOT NULL DEFAULT '{}',
  value       NUMERIC(12, 4) NOT NULL,
  valid_from  TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  priority    INTEGER        NOT NULL DEFAULT 0,
  active      BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  created_by  UUID           REFERENCES users(id),
  updated_by  UUID           REFERENCES users(id),
  deleted_at  TIMESTAMPTZ
);

-- ============================================================
-- QUOTATIONS
-- ============================================================
CREATE TABLE quotations (
  id              UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id       UUID           NOT NULL REFERENCES tenants(id),
  conversation_id UUID           REFERENCES conversations(id),
  customer_id     UUID           NOT NULL REFERENCES customers(id),
  opportunity_id  UUID,  -- FK added after opportunities table
  status          VARCHAR(50)    NOT NULL DEFAULT 'DRAFT',
  subtotal        NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tax             NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total           NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency        VARCHAR(10)    NOT NULL DEFAULT 'USD',
  valid_until     TIMESTAMPTZ,
  notes           TEXT,
  external_ref    VARCHAR(255),
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  created_by      UUID           REFERENCES users(id),
  updated_by      UUID           REFERENCES users(id),
  deleted_at      TIMESTAMPTZ
);

-- ============================================================
-- QUOTATION ITEMS
-- ============================================================
CREATE TABLE quotation_items (
  id           UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id    UUID           NOT NULL REFERENCES tenants(id),
  quotation_id UUID           NOT NULL REFERENCES quotations(id),
  product_id   UUID           REFERENCES products(id),
  description  TEXT           NOT NULL,
  quantity     NUMERIC(12, 4) NOT NULL,
  unit_price   NUMERIC(12, 2) NOT NULL,
  discount     NUMERIC(5, 2)  NOT NULL DEFAULT 0,
  total        NUMERIC(12, 2) NOT NULL,
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  created_by   UUID           REFERENCES users(id),
  updated_by   UUID           REFERENCES users(id)
);

-- ============================================================
-- PIPELINE — OPPORTUNITIES
-- ============================================================
CREATE TABLE opportunities (
  id                  UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id           UUID           NOT NULL REFERENCES tenants(id),
  customer_id         UUID           NOT NULL REFERENCES customers(id),
  quotation_id        UUID           REFERENCES quotations(id),
  title               VARCHAR(255)   NOT NULL,
  stage               VARCHAR(50)    NOT NULL DEFAULT 'NEW',
  estimated_value     NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency            VARCHAR(10)    NOT NULL DEFAULT 'USD',
  expected_close_date DATE,
  assigned_to         UUID           REFERENCES users(id),
  notes               TEXT,
  created_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  created_by          UUID           REFERENCES users(id),
  updated_by          UUID           REFERENCES users(id),
  deleted_at          TIMESTAMPTZ
);

ALTER TABLE quotations
  ADD CONSTRAINT fk_quotations_opportunity
  FOREIGN KEY (opportunity_id) REFERENCES opportunities(id);

-- ============================================================
-- WORKFLOW — DEFINITIONS
-- ============================================================
CREATE TABLE workflow_definitions (
  id            UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id     UUID         NOT NULL REFERENCES tenants(id),
  name          VARCHAR(255) NOT NULL,
  trigger_event VARCHAR(100) NOT NULL,
  steps         JSONB        NOT NULL DEFAULT '[]',
  active        BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_by    UUID         REFERENCES users(id),
  updated_by    UUID         REFERENCES users(id),
  deleted_at    TIMESTAMPTZ
);

-- ============================================================
-- WORKFLOW — EXECUTIONS
-- ============================================================
CREATE TABLE workflow_executions (
  id                     UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id              UUID        NOT NULL REFERENCES tenants(id),
  workflow_definition_id UUID        NOT NULL REFERENCES workflow_definitions(id),
  trigger_payload        JSONB       NOT NULL DEFAULT '{}',
  status                 VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  current_step           INTEGER     NOT NULL DEFAULT 0,
  context                JSONB       NOT NULL DEFAULT '{}',
  started_at             TIMESTAMPTZ,
  completed_at           TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by             UUID        REFERENCES users(id),
  updated_by             UUID        REFERENCES users(id)
);

-- ============================================================
-- WORKFLOW — APPROVAL REQUESTS
-- ============================================================
CREATE TABLE approval_requests (
  id                    UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id             UUID        NOT NULL REFERENCES tenants(id),
  workflow_execution_id UUID        NOT NULL REFERENCES workflow_executions(id),
  resource_type         VARCHAR(50) NOT NULL,
  resource_id           UUID        NOT NULL,
  requested_by          UUID        NOT NULL REFERENCES users(id),
  assigned_to           UUID        REFERENCES users(id),
  status                VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  decision              VARCHAR(50),
  decision_by           UUID        REFERENCES users(id),
  decision_at           TIMESTAMPTZ,
  comment               TEXT,
  expires_at            TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by            UUID        REFERENCES users(id),
  updated_by            UUID        REFERENCES users(id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_conversations_tenant_customer     ON conversations(tenant_id, customer_id);
CREATE INDEX idx_messages_conversation             ON messages(conversation_id);
CREATE INDEX idx_quotations_tenant_status          ON quotations(tenant_id, status);
CREATE INDEX idx_quotations_customer               ON quotations(customer_id);
CREATE INDEX idx_opportunities_tenant_stage        ON opportunities(tenant_id, stage);
CREATE INDEX idx_customers_tenant_phone            ON customers(tenant_id, phone);
CREATE INDEX idx_products_tenant_status            ON products(tenant_id, status);
CREATE INDEX idx_approval_requests_tenant_status   ON approval_requests(tenant_id, status);
CREATE INDEX idx_workflow_executions_tenant_status ON workflow_executions(tenant_id, status);

-- Partial indexes to exclude soft-deleted rows from default scans
CREATE INDEX idx_conversations_active  ON conversations(tenant_id)   WHERE deleted_at IS NULL;
CREATE INDEX idx_quotations_active     ON quotations(tenant_id)      WHERE deleted_at IS NULL;
CREATE INDEX idx_opportunities_active  ON opportunities(tenant_id)   WHERE deleted_at IS NULL;
CREATE INDEX idx_customers_active      ON customers(tenant_id)       WHERE deleted_at IS NULL;
CREATE INDEX idx_products_active       ON products(tenant_id)        WHERE deleted_at IS NULL;
