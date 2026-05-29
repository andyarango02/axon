-- ============================================================
-- 002 — Catalog improvements
-- ============================================================

-- Products: distinguish physical goods from services; base_price is optional for services
ALTER TABLE products
  ADD COLUMN type VARCHAR(50) NOT NULL DEFAULT 'PHYSICAL';

ALTER TABLE products
  ALTER COLUMN base_price DROP NOT NULL;

-- Pricing rules: name for human identification, own currency, category scope, list grouping
ALTER TABLE pricing_rules
  ADD COLUMN name          VARCHAR(255),
  ADD COLUMN currency      VARCHAR(10),
  ADD COLUMN category      VARCHAR(100),
  ADD COLUMN price_list_id UUID;

-- ============================================================
-- CATALOG — PRICE LISTS
-- Named, currency-bound, date-scoped containers for pricing rules
-- ============================================================
CREATE TABLE price_lists (
  id          UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id   UUID         NOT NULL REFERENCES tenants(id),
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  currency    VARCHAR(10)  NOT NULL DEFAULT 'USD',
  valid_from  TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  active      BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_by  UUID         REFERENCES users(id),
  updated_by  UUID         REFERENCES users(id),
  deleted_at  TIMESTAMPTZ,
  UNIQUE (tenant_id, name)
);

ALTER TABLE pricing_rules
  ADD CONSTRAINT fk_pricing_rules_price_list
  FOREIGN KEY (price_list_id) REFERENCES price_lists(id);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_price_lists_tenant
  ON price_lists(tenant_id)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_pricing_rules_price_list
  ON pricing_rules(tenant_id, price_list_id)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_pricing_rules_category
  ON pricing_rules(tenant_id, category)
  WHERE deleted_at IS NULL AND active = TRUE;

CREATE INDEX idx_products_type
  ON products(tenant_id, type)
  WHERE deleted_at IS NULL;
