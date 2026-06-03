-- ============================================================
-- Drop FK constraints on created_by / updated_by
--
-- These audit fields were defined as REFERENCES public.users(id),
-- but in production the UUIDs come from auth.users (Supabase Auth).
-- Dropping the FK keeps the UUID type but removes the referential
-- constraint so any auth.users UUID (or null for automated actions)
-- can be stored without a violation.
-- ============================================================

ALTER TABLE customers          DROP CONSTRAINT IF EXISTS customers_created_by_fkey;
ALTER TABLE customers          DROP CONSTRAINT IF EXISTS customers_updated_by_fkey;

ALTER TABLE conversations      DROP CONSTRAINT IF EXISTS conversations_created_by_fkey;
ALTER TABLE conversations      DROP CONSTRAINT IF EXISTS conversations_updated_by_fkey;

ALTER TABLE messages           DROP CONSTRAINT IF EXISTS messages_created_by_fkey;
ALTER TABLE messages           DROP CONSTRAINT IF EXISTS messages_updated_by_fkey;

ALTER TABLE products           DROP CONSTRAINT IF EXISTS products_created_by_fkey;
ALTER TABLE products           DROP CONSTRAINT IF EXISTS products_updated_by_fkey;

ALTER TABLE pricing_rules      DROP CONSTRAINT IF EXISTS pricing_rules_created_by_fkey;
ALTER TABLE pricing_rules      DROP CONSTRAINT IF EXISTS pricing_rules_updated_by_fkey;

ALTER TABLE price_lists        DROP CONSTRAINT IF EXISTS price_lists_created_by_fkey;
ALTER TABLE price_lists        DROP CONSTRAINT IF EXISTS price_lists_updated_by_fkey;

ALTER TABLE quotations         DROP CONSTRAINT IF EXISTS quotations_created_by_fkey;
ALTER TABLE quotations         DROP CONSTRAINT IF EXISTS quotations_updated_by_fkey;

ALTER TABLE quotation_items    DROP CONSTRAINT IF EXISTS quotation_items_created_by_fkey;
ALTER TABLE quotation_items    DROP CONSTRAINT IF EXISTS quotation_items_updated_by_fkey;

ALTER TABLE opportunities      DROP CONSTRAINT IF EXISTS opportunities_created_by_fkey;
ALTER TABLE opportunities      DROP CONSTRAINT IF EXISTS opportunities_updated_by_fkey;

ALTER TABLE workflow_definitions  DROP CONSTRAINT IF EXISTS workflow_definitions_created_by_fkey;
ALTER TABLE workflow_definitions  DROP CONSTRAINT IF EXISTS workflow_definitions_updated_by_fkey;

ALTER TABLE workflow_executions   DROP CONSTRAINT IF EXISTS workflow_executions_created_by_fkey;
ALTER TABLE workflow_executions   DROP CONSTRAINT IF EXISTS workflow_executions_updated_by_fkey;

ALTER TABLE approval_requests     DROP CONSTRAINT IF EXISTS approval_requests_created_by_fkey;
ALTER TABLE approval_requests     DROP CONSTRAINT IF EXISTS approval_requests_updated_by_fkey;
